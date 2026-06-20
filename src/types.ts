export interface Exercise {
  exerciseId: number;
  title: string;
  instructions: string;
  chartDataJson: string | null;
  mediaType: string | null;
  mediaPath: string | null;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string | null;
  correctAnswer: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export function normalizeChartData(raw: string | null | undefined): ChartPoint[] | null {
  if (!raw) return null;
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  const sample = parsed[0];
  if (!sample || typeof sample !== "object") return null;

  const labelKey = Object.keys(sample).find((k) => typeof sample[k] === "string");
  const valueKey = Object.keys(sample).find((k) => typeof sample[k] === "number");
  if (!labelKey || !valueKey) return null;

  return parsed
    .map((item) => ({
      label: String(item[labelKey]),
      value: Number(item[valueKey]),
    }))
    .filter((p) => !isNaN(p.value));
}
