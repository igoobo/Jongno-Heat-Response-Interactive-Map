from typing import List


def interpolate_temperatures(temps_3hr: List[float]) -> List[float]:
    if not temps_3hr or len(temps_3hr) < 2:
        return temps_3hr if temps_3hr is not None else []

    temps_1hr: List[float] = []
    for i in range(len(temps_3hr) - 1):
        start_temp = temps_3hr[i]
        end_temp = temps_3hr[i + 1]
        step = (end_temp - start_temp) / 3.0

        temps_1hr.extend([start_temp, start_temp + step, start_temp + step * 2])

    temps_1hr.append(temps_3hr[-1])
    return temps_1hr
