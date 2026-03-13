import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, MapPin, Target, ArrowRight } from "lucide-react";
import { saveProfile, Profile, setCurrentUser, generateId } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        location: "Pasto, Nariño, Colombia",
        position: "Delantero",
        foot: "Derecho",
    });
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const newProfile: Profile = {
            id: generateId(),
            ...formData,
            role: 'user',
            stats: {
                matches: 0,
                goals: 0,
                assists: 0,
                rating: 5.0,
            }
        };

        const success = await saveProfile(newProfile);

        if (success) {
            setCurrentUser(newProfile);
            toast({
                title: "Cuenta creada con éxito",
                description: `Bienvenido a la cancha, ${formData.name}.`,
            });
            navigate("/");
        } else {
            toast({
                variant: "destructive",
                title: "Error al registrar",
                description: "No se pudo conectar con el servidor. Por favor, asegúrate de que el servidor de datos esté corriendo (npm run dev:all).",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <Card className="w-full max-w-lg border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-green-950">Únete al Barrio</CardTitle>
                    <CardDescription>Crea tu perfil para empezar a organizar partidos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                                    <Input id="name" placeholder="Tu Nombre" className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                                    <Input id="email" type="email" placeholder="tu@correo.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                                    <Input id="password" type="password" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                                    <Input id="location" className="pl-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Posición</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
                                    <option>Portero</option>
                                    <option>Defensa</option>
                                    <option>Mediocampista</option>
                                    <option>Delantero</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="foot">Pie Hábil</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" value={formData.foot} onChange={(e) => setFormData({ ...formData, foot: e.target.value })}>
                                    <option>Derecho</option>
                                    <option>Izquierdo</option>
                                    <option>Ambidiestro</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11">
                            Finalizar Registro
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-green-50 pt-6 pb-6">
                    <p className="text-sm text-green-800/70">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-green-600 font-bold">Inicia sesión</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
