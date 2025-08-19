import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Edit } from "lucide-react";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  mensalidade: number;
  status_pagamento: "Pago" | "Pendente";
  created_at: string;
  updated_at: string;
}

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  mensalidade: z.number().min(0, "Mensalidade deve ser maior que 0"),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

const Painel = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const { toast } = useToast();

  const form = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: "",
      matricula: "",
      mensalidade: 0,
    },
  });

  const fetchAlunos = async () => {
    // Dados mockados para demonstração
    const mockData: Aluno[] = [
      {
        id: "1",
        nome: "João Silva",
        matricula: "MAT001",
        mensalidade: 850.00,
        status_pagamento: "Pago",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2", 
        nome: "Maria Santos",
        matricula: "MAT002",
        mensalidade: 850.00,
        status_pagamento: "Pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        nome: "Pedro Oliveira", 
        matricula: "MAT003",
        mensalidade: 900.00,
        status_pagamento: "Pago",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "4",
        nome: "Ana Costa",
        matricula: "MAT004", 
        mensalidade: 850.00,
        status_pagamento: "Pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    setAlunos(mockData);
    setLoading(false);
    
    toast({
      title: "Aviso",
      description: "Usando dados de demonstração. Para funcionalidade completa, ative a integração com Supabase.",
      variant: "destructive",
    });
  };

  const toggleStatusPagamento = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pago" ? "Pendente" : "Pago";
    
    // Simulação para demonstração
    setAlunos(alunos.map(aluno => 
      aluno.id === id ? { ...aluno, status_pagamento: newStatus as "Pago" | "Pendente" } : aluno
    ));

    toast({
      title: "Status atualizado (demo)",
      description: `Status alterado para ${newStatus}. Para persistir dados, ative o Supabase.`,
    });
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Matrícula", "Mensalidade", "Status Pagamento"];
    const csvContent = [
      headers.join(","),
      ...alunos.map(aluno => [
        `"${aluno.nome}"`,
        `"${aluno.matricula}"`,
        aluno.mensalidade.toString(),
        `"${aluno.status_pagamento}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alunos.csv";
    link.click();

    toast({
      title: "Exportação concluída",
      description: "Dados exportados para CSV com sucesso",
    });
  };

  const onSubmit = async (data: AlunoFormData) => {
    // Simulação para demonstração
    if (editingAluno) {
      setAlunos(alunos.map(aluno => 
        aluno.id === editingAluno.id 
          ? { ...aluno, nome: data.nome, matricula: data.matricula, mensalidade: data.mensalidade }
          : aluno
      ));
      
      toast({
        title: "Aluno atualizado (demo)",
        description: "Para persistir dados, ative a integração com Supabase",
      });
    } else {
      const novoAluno: Aluno = {
        id: Date.now().toString(),
        nome: data.nome,
        matricula: data.matricula,
        mensalidade: data.mensalidade,
        status_pagamento: "Pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setAlunos([...alunos, novoAluno]);
      
      toast({
        title: "Aluno adicionado (demo)",
        description: "Para persistir dados, ative a integração com Supabase",
      });
    }

    setIsDialogOpen(false);
    setEditingAluno(null);
    form.reset();
  };

  const openEditDialog = (aluno: Aluno) => {
    setEditingAluno(aluno);
    form.reset({
      nome: aluno.nome,
      matricula: aluno.matricula,
      mensalidade: aluno.mensalidade,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingAluno(null);
    form.reset({
      nome: "",
      matricula: "",
      mensalidade: 0,
    });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Painel de Controle Escolar</CardTitle>
          <CardDescription>
            Gerencie alunos, mensalidades e status de pagamento
          </CardDescription>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Aluno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingAluno ? "Editar Aluno" : "Novo Aluno"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAluno 
                      ? "Atualize os dados do aluno" 
                      : "Preencha os dados do novo aluno"
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="matricula"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula</FormLabel>
                          <FormControl>
                            <Input placeholder="MAT001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mensalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensalidade</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="850.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      {editingAluno ? "Atualizar" : "Cadastrar"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead>Status Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">{aluno.nome}</TableCell>
                  <TableCell>{aluno.matricula}</TableCell>
                  <TableCell>R$ {aluno.mensalidade.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={aluno.status_pagamento === "Pago" ? "default" : "secondary"}
                    >
                      {aluno.status_pagamento}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatusPagamento(aluno.id, aluno.status_pagamento)}
                      >
                        {aluno.status_pagamento === "Pago" ? "Marcar Pendente" : "Marcar Pago"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(aluno)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {alunos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum aluno cadastrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Painel;