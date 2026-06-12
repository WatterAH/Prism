import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { Plus, LogOut } from "lucide-react";

interface User {
  userId: number;
  username: string;
  role: string;
}

interface Props {
  navigate: (path: string) => void;
}

export function DashboardPage() {
  const navigate = useNavigate();
  return <Dashboard navigate={navigate} />;
}

class Dashboard extends React.Component<Props> {
  get user(): User | null {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }

  handleLogout = () => {
    sessionStorage.removeItem("user");
    this.props.navigate("/");
  };

  render() {
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
                <span style={{ fontWeight: 500, color: "#16140f" }}>
                  {this.user?.username ?? "—"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={this.handleLogout}
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

        <div className="card rounded-4 px-4 pt-4 pb-3" style={{ backgroundColor: "#fff" }}>
          <div className="d-flex align-items-center justify-content-between mb-4">
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
                Gestión
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
                Crear, altas, bajas y cambios de ejercicios
              </h4>
            </div>
            <Button Icon={Plus} iconPosition="start">
              Crear ejercicio
            </Button>
          </div>

          <table className="table" style={{ fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e8e8" }}>
                <th style={{ fontWeight: 500, color: "#737373", paddingBottom: "10px" }}>
                  Ejercicio
                </th>
                <th
                  style={{
                    fontWeight: 500,
                    color: "#737373",
                    paddingBottom: "10px",
                    width: "120px",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2} className="text-center py-4" style={{ color: "#a3a3a3" }}>
                  No hay ejercicios registrados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
