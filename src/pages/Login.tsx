import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveProfile, Profile, setCurrentUser, getProfiles } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const profiles = await getProfiles();
        const user = profiles.find(p => p.email === email && (p.password === password || p.role === 'admin'));

        if (user) {
            setCurrentUser(user);
            toast({
                title: "Inicio de sesión exitoso",
                description: `Bienvenido de nuevo, ${user.name}.`,
            });
            navigate("/");
        } else {
            toast({
                title: "Error de acceso",
                description: "Credenciales incorrectas o usuario no encontrado.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-300/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-green-200/50">
                <CardHeader className="space-y-4 pb-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src="/logo.png"
                                alt="BarrioFútbol Logo"
                                className="relative h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-green-950">
                        ¡De vuelta a la cancha!
                    </CardTitle>
                    <CardDescription className="text-base text-green-700/80">
                        Ingresa tus datos para organizar tu próximo partido.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-green-900 font-medium ml-1">Correo Electrónico</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600 transition-colors group-focus-within:text-green-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 border-green-100 bg-white/50 focus:bg-white focus:border-green-400 text-green-950 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-green-900 font-medium ml-1">Contraseña</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-green-600 hover:text-green-800 transition-colors font-medium"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600 transition-colors group-focus-within:text-green-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 border-green-100 bg-white/50 focus:bg-white focus:border-green-400 text-green-950 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 transform hover:translate-y-[-2px] active:scale-[0.98] shadow-lg shadow-green-200"
                        >
                            Iniciar Sesión
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <p className="text-sm text-green-800/70">
                        ¿Aún no tienes equipo?{" "}
                        <Link to="/register" className="text-green-600 hover:text-green-800 font-bold transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
