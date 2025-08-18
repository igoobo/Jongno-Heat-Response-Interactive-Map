import os
import json
import numpy as np
import faiss
import fitz  # PyMuPDF
import easyocr
from sentence_transformers import SentenceTransformer
import logging
from typing import List, Dict

# --- 초기 설정 ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- 상수 정의 ---
PDF_DIR = "documents"  # PDF 파일들이 있는 디렉토리
STORAGE_DIR = "storage"
FAISS_INDEX_PATH = os.path.join(STORAGE_DIR, "vector.index")
CHUNKS_PATH = os.path.join(STORAGE_DIR, "chunks_with_metadata.json")

# --- 데이터 처리 함수 ---

def extract_text_from_pdf_with_ocr(pdf_path: str, reader: easyocr.Reader) -> str:
    """OCR을 사용하여 단일 PDF 파일에서 텍스트를 추출합니다."""
    logging.info(f"'{pdf_path}' 파일에서 텍스트 추출을 시작합니다.")
    doc = fitz.open(pdf_path)
    full_text = ""
    for i, page in enumerate(doc):
        logging.info(f"'{os.path.basename(pdf_path)}': {len(doc)} 페이지 중 {i+1}번째 페이지 OCR 진행 중...")
        pix = page.get_pixmap(dpi=300)
        img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        if img_np.shape[2] == 4:
            img_np = img_np[:, :, :3]
        
        result = reader.readtext(img_np, detail=0, paragraph=True)
        page_text = "\n".join(result)
        full_text += page_text + "\n\n"
    
    doc.close()
    return full_text

def split_text_into_chunks(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[str]:
    """긴 텍스트를 지정된 크기의 청크로 분할합니다."""
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    return text_splitter.split_text(text)

def main():
    """
    documents 폴더 내의 모든 PDF를 전처리하고 결과를 파일로 저장합니다.
    """
    os.makedirs(STORAGE_DIR, exist_ok=True)
    
    # 1. 모델 로드
    logging.info("OCR 리더 및 임베딩 모델을 로드합니다.")
    ocr_reader = easyocr.Reader(['ko', 'en'])
    embedding_model = SentenceTransformer('jhgan/ko-sbert-nli')

    all_chunks_with_metadata = []
    
    # 2. 지정된 디렉토리의 모든 PDF 파일 처리
    if not os.path.exists(PDF_DIR):
        raise FileNotFoundError(f"문서 디렉토리를 찾을 수 없습니다: '{PDF_DIR}'")
        
    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')]
    if not pdf_files:
        logging.warning(f"'{PDF_DIR}' 디렉토리에서 PDF 파일을 찾을 수 없습니다.")
        return

    for pdf_file in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_file)
        
        # 2-1. PDF에서 텍스트 추출
        document_text = extract_text_from_pdf_with_ocr(pdf_path, ocr_reader)
        
        # 2-2. 텍스트를 청크로 분할
        chunks = split_text_into_chunks(document_text)
        
        # 2-3. 각 청크에 메타데이터(출처) 추가
        for chunk in chunks:
            all_chunks_with_metadata.append({
                "content": chunk,
                "source": pdf_file  # 어떤 문서에서 왔는지 파일명 저장
            })
            
    if not all_chunks_with_metadata:
        logging.warning("처리할 텍스트 청크가 없습니다.")
        return

    logging.info(f"총 {len(all_chunks_with_metadata)}개의 텍스트 청크를 생성했습니다.")

    # 3. 모든 청크 내용을 임베딩
    logging.info("모든 텍스트 청크에 대한 임베딩을 생성합니다.")
    chunk_contents = [item['content'] for item in all_chunks_with_metadata]
    chunk_embeddings = embedding_model.encode(chunk_contents, show_progress_bar=True)
    
    # 4. FAISS 인덱스 생성
    logging.info("FAISS 인덱스를 구축합니다.")
    embedding_dim = chunk_embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(embedding_dim)
    faiss_index.add(chunk_embeddings)

    # 5. 결과물 파일로 저장
    logging.info(f"FAISS 인덱스를 '{FAISS_INDEX_PATH}' 파일에 저장합니다.")
    faiss.write_index(faiss_index, FAISS_INDEX_PATH)

    logging.info(f"메타데이터를 포함한 텍스트 청크를 '{CHUNKS_PATH}' 파일에 저장합니다.")
    with open(CHUNKS_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_chunks_with_metadata, f, ensure_ascii=False, indent=4)
        
    logging.info("모든 전처리 과정이 완료되었습니다.")

if __name__ == "__main__":
    main()