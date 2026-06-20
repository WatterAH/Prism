import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { LogOut, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import request, { ApiError } from "../lib/request";
import { Exercise } from "../types";

interface FormState {
  title: string;
  instructions: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  correctAnswer: string;
  mediaType: string;
  mediaPath: string;
  chartDataJson: string;
}

const emptyForm: FormState = {
  title: "",
  instructions: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  option5: "",
  correctAnswer: "1",
  mediaType: "",
  mediaPath: "",
  chartDataJson: "",
};

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function ExerciseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!isEdit) return;
    request
      .get<Exercise>(`/api/exercises/${id}`)
      .then((ex) => {
        setForm({
          title: ex.title ?? "",
          instructions: ex.instructions ?? "",
          option1: ex.option1 ?? "",
          option2: ex.option2 ?? "",
          option3: ex.option3 ?? "",
          option4: ex.option4 ?? "",
          option5: ex.option5 ?? "",
          correctAnswer: String(ex.correctAnswer ?? 1),
          mediaType: ex.mediaType ?? "",
          mediaPath: ex.mediaPath ?? "",
          chartDataJson: ex.chartDataJson ?? "",
        });
      })
      .catch(() => toast.error("Error al cargar el ejercicio"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.chartDataJson.trim()) {
      try {
        JSON.parse(form.chartDataJson);
      } catch {
        toast.error("El JSON de la gráfica no es válido");
        return;
      }
    }
    const payload = {
      title: form.title,
      instructions: form.instructions,
      option1: form.option1,
      option2: form.option2,
      option3: form.option3,
      option4: form.option4,
      option5: form.option5 || null,
      correctAnswer: parseInt(form.correctAnswer),
      mediaType: form.mediaType || null,
      mediaPath: form.mediaPath || null,
      chartDataJson: form.chartDataJson || null,
    };
    try {
      setSubmitting(true);
      if (isEdit) {
        await request.put<Exercise>(`/api/exercises/${id}`, payload);
        toast.success("Ejercicio actualizado");
      } else {
        await request.post<Exercise>("/api/exercises", payload);
        toast.success("Ejercicio creado");
      }
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
      else toast.error("Error al guardar el ejercicio");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const fieldStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "#16140f" };
  const subLabelStyle: React.CSSProperties = { fontSize: 13, color: "#737373" };

  return (
    <div
      style={{
        backgroundColor: "#f4f3f0",
        backgroundImage: "radial-gradient(circle, #d1d1d1 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* Navbar */}
      <div
        className="card rounded-4 px-4 py-3 d-flex flex-row align-items-center justify-content-between mb-4"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="d-flex align-items-center gap-3">
          <Logo />
          <div>
            <h3
              className="mb-0"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#16140f",
              }}
            >
              Prism
            </h3>
            <p className="mb-0" style={{ fontSize: "13px", color: "#737373" }}>
              Bienvenido,{" "}
              <span style={{ fontWeight: 500, color: "#16140f" }}>{user?.username ?? "—"}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="d-flex align-items-center gap-2"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: "#737373",
            padding: "6px 10px",
            borderRadius: "8px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f3f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LogOut size={15} />
          Salir de la aplicación
        </button>
      </div>

      {/* Form card */}
      <div
        className="card rounded-4 px-4 pt-4 pb-4"
        style={{ backgroundColor: "#fff", maxWidth: 680 }}
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <ChevronLeft size={20} color="#737373" />
          </button>
          <div>
            <p
              className="mb-0"
              style={{
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "#a3a3a3",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Ejercicios
            </p>
            <h4
              className="mb-0"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: "20px",
                color: "#16140f",
                letterSpacing: "-0.01em",
              }}
            >
              {isEdit ? "Modificar ejercicio" : "Crear nuevo ejercicio"}
            </h4>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border" style={{ color: "#737373" }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Título */}
            <div>
              <label className="form-label mb-1" style={fieldStyle}>
                Título *
              </label>
              <input
                className="form-control"
                style={{ fontSize: 14 }}
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Ej. Distribución de frecuencias"
              />
            </div>

            {/* Instrucciones */}
            <div>
              <label className="form-label mb-1" style={fieldStyle}>
                Instrucciones *
              </label>
              <textarea
                className="form-control"
                style={{ fontSize: 14 }}
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe el contexto o pregunta del ejercicio..."
              />
            </div>

            <hr style={{ borderColor: "#e8e8e8", margin: "4px 0" }} />
            <p className="mb-0" style={fieldStyle}>
              Opciones de respuesta
            </p>

            {([1, 2, 3, 4, 5] as const).map((n) => (
              <div key={n}>
                <label className="form-label mb-1" style={subLabelStyle}>
                  Opción {n} {n <= 4 ? "*" : "(opcional)"}
                </label>
                <input
                  className="form-control"
                  style={{ fontSize: 14 }}
                  name={`option${n}`}
                  value={(form as any)[`option${n}`]}
                  onChange={handleChange}
                  required={n <= 4}
                  placeholder={`Texto de la opción ${n}`}
                />
              </div>
            ))}

            <div>
              <label className="form-label mb-1" style={fieldStyle}>
                Respuesta correcta *
              </label>
              <select
                className="form-select"
                style={{ fontSize: 14 }}
                name="correctAnswer"
                value={form.correctAnswer}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    Opción {n}
                  </option>
                ))}
              </select>
            </div>

            <hr style={{ borderColor: "#e8e8e8", margin: "4px 0" }} />
            <p className="mb-0" style={fieldStyle}>
              Multimedia
            </p>

            <div>
              <label className="form-label mb-1" style={subLabelStyle}>
                Tipo de media
              </label>
              <select
                className="form-select"
                style={{ fontSize: 14 }}
                name="mediaType"
                value={form.mediaType}
                onChange={handleChange}
              >
                <option value="">Ninguno</option>
                <option value="img">Imagen (JPG / PNG)</option>
                <option value="video">Video (MP4)</option>
                <option value="audio">Audio (MP3)</option>
              </select>
            </div>

            {form.mediaType && (
              <div>
                <label className="form-label mb-1" style={subLabelStyle}>
                  URL de la media
                </label>
                <input
                  className="form-control"
                  style={{ fontSize: 14 }}
                  name="mediaPath"
                  value={form.mediaPath}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            )}

            <hr style={{ borderColor: "#e8e8e8", margin: "4px 0" }} />

            {/* Chart JSON */}
            <div>
              <label className="form-label mb-1" style={fieldStyle}>
                Datos de la gráfica (JSON)
              </label>
              <textarea
                className="form-control"
                name="chartDataJson"
                value={form.chartDataJson}
                onChange={handleChange}
                rows={4}
                placeholder='[{"label":"Spotify","value":85},{"label":"Apple Music","value":42},{"label":"YouTube","value":67}]'
                style={{ fontFamily: "monospace", fontSize: 12 }}
              />
              <p className="mt-1 mb-0" style={{ fontSize: 11, color: "#a3a3a3" }}>
                Array de objetos con un campo de texto (etiqueta) y uno numérico (valor).
                También funciona con claves como {`{week, rank}`}.
              </p>
            </div>

            <div className="d-flex gap-2 mt-2">
              <button
                type="submit"
                className="btn btn-dark btn-sm px-4"
                disabled={submitting}
                style={{ borderRadius: 8 }}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : isEdit ? (
                  "Guardar cambios"
                ) : (
                  "Crear ejercicio"
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-4"
                onClick={() => navigate("/dashboard")}
                style={{ borderRadius: 8 }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
