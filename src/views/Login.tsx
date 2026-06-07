import React from "react";
import { Input } from "../components/ui/Input";
import { KeyRound, MoveRight, UserRound } from "lucide-react";
import { Label } from "../components/ui/Label";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import request from "../lib/request";

interface State {
  loading: boolean;
  form: {
    user: string;
    password: string;
  };
  error: string | null;
}

export class Login extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: false,
      form: {
        user: "",
        password: "",
      },
      error: null,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      this.setState({ loading: true, error: null });
      await request.post("/api/auth/login", {
        username: this.state.form.user,
        password: this.state.form.password,
      });
    } catch (error: any) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div
        id="login-view"
        className="container-fluid d-flex flex-column justify-content-center align-items-center w-100 vh-100"
      >
        <div
          className="card rounded-4 px-3 pt-3 pb-0"
          style={{
            maxWidth: "380px",
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <div className="card-body">
            <div className="d-flex gap-3 mb-4">
              <Logo />
              <div>
                <h3
                  className="mb-0"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "23px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#16140f",
                  }}
                >
                  Prism
                </h3>
                <p
                  className="mb-0"
                  style={{
                    fontSize: "14px",
                    color: "#737373",
                  }}
                >
                  Ánalisis y Diseño de Sistemas
                </p>
              </div>
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="d-flex flex-column gap-3 mt-4"
            >
              <div className="d-flex flex-column gap-1">
                <Label htmlFor="user">Usuario</Label>
                <Input
                  value={this.state.form.user}
                  onChange={this.handleChange}
                  type="text"
                  id="user"
                  name="user"
                  placeholder="Usuario"
                  Icon={UserRound}
                  required
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  value={this.state.form.password}
                  onChange={this.handleChange}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Contraseña"
                  Icon={KeyRound}
                  required
                />
              </div>
              <div className="position-relative mt-4">
                <Button
                  type="submit"
                  className="w-100"
                  Icon={MoveRight}
                  iconPosition="end"
                >
                  Iniciar Sesión
                </Button>
              </div>
            </form>
            <p
              className="mt-4 text-center"
              style={{
                fontSize: "12px",
                color: "#737373",
              }}
            >
              Acceso restringido · Prism © 2026
            </p>
          </div>
        </div>
      </div>
    );
  }
}
