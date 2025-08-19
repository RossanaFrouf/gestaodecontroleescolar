// Update this page (the content is just a fallback if you fail to update the page)

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Sistema de Controle Escolar</h1>
        <p className="text-xl text-muted-foreground">Gerencie alunos e pagamentos de forma simples</p>
        <Button asChild size="lg">
          <Link to="/painel">Acessar Painel</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
