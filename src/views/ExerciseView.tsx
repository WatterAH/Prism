import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { LogOut, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import request from "../lib/request";
import { Exercise, normalizeChartData } from "../types";
import { D3Chart } from "../components/ui/D3Chart";

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getOptions(ex: Exercise): [number, string][] {
  const opts: [number, string][] = [];
  if (ex.option1) opts.push([1, ex.option1]);
  if (ex.option2) opts.push([2, ex.option2]);
  if (ex.option3) opts.push([3, ex.option3]);
  if (ex.option4) opts.push([4, ex.option4]);
  if (ex.option5) opts.push([5, ex.option5]);
  return opts;
}

export function ExerciseViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    request
      .get<Exercise>(`/api/exercises/${id}`)
      .then(setExercise)
      .catch(() => toast.error("Error al cargar el ejercicio"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const chartData = exercise ? normalizeChartData(exercise.chartDataJson) : null;

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

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#737373" }} />
        </div>
      ) : !exercise ? (
        <div className="card rounded-4 p-4 text-center" style={{ backgroundColor: "#fff" }}>
          <p style={{ color: "#737373", marginBottom: 12 }}>Ejercicio no encontrado.</p>
          <button className="btn btn-dark btn-sm" onClick={() => navigate("/dashboard")}>
            Volver al dashboard
          </button>
        </div>
      ) : (
        <div
          className="card rounded-4 px-4 pt-4 pb-4"
          style={{ backgroundColor: "#fff", maxWidth: 740 }}
        >
          {/* Header with back */}
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
                Ver ejercicio
              </h4>
            </div>
          </div>

          {/* Title */}
          <h5
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              color: "#16140f",
              marginBottom: 8,
            }}
          >
            {exercise.title}
          </h5>

          {/* Instructions */}
          <p style={{ color: "#737373", fontSize: 14, marginBottom: 24 }}>
            {exercise.instructions}
          </p>

          {/* Options + Chart */}
          <div className="d-flex gap-4 mb-4 flex-wrap">
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Opciones de respuesta
              </p>
              {getOptions(exercise).map(([n, text]) => (
                <div
                  key={n}
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    backgroundColor: n === exercise.correctAnswer ? "#f0fdf4" : "#fafafa",
                    border: `1px solid ${n === exercise.correctAnswer ? "#bbf7d0" : "#e8e8e8"}`,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${n === exercise.correctAnswer ? "#16803c" : "#d4d4d4"}`,
                      backgroundColor: n === exercise.correctAnswer ? "#16803c" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {n === exercise.correctAnswer && (
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
                        ✓
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: n === exercise.correctAnswer ? "#16803c" : "#737373",
                      fontWeight: n === exercise.correctAnswer ? 600 : 400,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {chartData && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  Gráfica
                </p>
                <D3Chart data={chartData} width={340} height={250} />
              </div>
            )}
          </div>

          {/* Multimedia */}
          {exercise.mediaType && exercise.mediaPath && (
            <div className="mb-4">
              <p style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Multimedia
              </p>
              {exercise.mediaType === "img" && (
                <img
                  src={exercise.mediaPath}
                  alt="Media del ejercicio"
                  style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 280 }}
                />
              )}
              {exercise.mediaType === "video" && (
                <video
                  src={exercise.mediaPath}
                  controls
                  style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 280 }}
                />
              )}
              {exercise.mediaType === "audio" && (
                <audio src={exercise.mediaPath} controls style={{ width: "100%" }} />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-dark btn-sm px-3"
              style={{ borderRadius: 8 }}
              onClick={() => navigate(`/exercises/${exercise.exerciseId}/probar`)}
            >
              Probar ejercicio
            </button>
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              style={{ borderRadius: 8 }}
              onClick={() => navigate(`/exercises/${exercise.exerciseId}/edit`)}
            >
              Modificar
            </button>
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              style={{ borderRadius: 8 }}
              onClick={() => navigate("/dashboard")}
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
