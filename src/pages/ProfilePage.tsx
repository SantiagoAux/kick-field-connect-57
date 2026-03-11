import { Star, MapPin, Calendar, Shield, Users, Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const stats = [
  { label: "Partidos", value: "47" },
  { label: "Goles", value: "23" },
  { label: "Asistencias", value: "15" },
  { label: "Rating", value: "4.3" },
];

const ratings = [
  { label: "Nivel de juego", value: 4.2 },
  { label: "Trabajo en equipo", value: 4.5 },
  { label: "Puntualidad", value: 4.8 },
  { label: "Fair Play", value: 4.6 },
];

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">JP</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Juan Pérez</h1>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">Santiago Centro</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-label bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Mediocampista</span>
        <span className="text-label bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">Pie derecho</span>
        <span className="text-label bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">Nivel 4</span>
      </div>

      <p className="text-sm text-muted-foreground">
        Mediocampista creativo con buena visión de juego. Prefiero jugar por la banda derecha. Disponible fines de semana y miércoles.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center rounded-xl bg-secondary p-3">
            <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Ratings */}
      <section>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Calificaciones
        </h2>
        <div className="space-y-3">
          {ratings.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm">{r.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(r.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums w-8 text-right">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Teams */}
      <section>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Mis Equipos
        </h2>
        <div className="space-y-2">
          {["Los Cracks FC", "Real Vecinos"].map((team) => (
            <div key={team} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{team}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Match History */}
      <section>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Últimos Partidos
        </h2>
        <div className="space-y-2">
          {[
            { date: "Lun 10 Mar", teams: "Los Cracks vs Real Vecinos", result: "3-2" },
            { date: "Sáb 8 Mar", teams: "Barrio FC vs Los Cracks", result: "1-1" },
            { date: "Mié 5 Mar", teams: "Los Cracks vs Deportivo Sur", result: "4-0" },
          ].map((match, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
              <div>
                <p className="text-sm font-medium">{match.teams}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{match.date}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">{match.result}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
