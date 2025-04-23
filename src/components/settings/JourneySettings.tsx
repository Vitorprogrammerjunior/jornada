
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const JourneySettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [phases, setPhases] = useState<string[]>([]);
  const [newPhase, setNewPhase] = useState("");
  const form = useForm();

  const { data: journeySettings, isLoading } = useQuery({
    queryKey: ["journeySettings"],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            journeyName: "Jornada 2024",
            startDate: new Date("2024-03-01"),
            endDate: new Date("2024-12-01"),
            maxGroupSize: 5,
            enableMentoring: true,
            phases: ["Ideação", "Prototipação", "Validação", "Implementação"],
          });
        }, 1000);
      });
    },
    meta: {
      onSuccess: (data: any) => {
        console.log("Journey settings loaded successfully:", data);
        setPhases(data.phases);
      },
      onError: (error: any) => {
        toast.error("Erro ao carregar configurações da jornada");
      }
    }
  });

  const handleAddPhase = () => {
    if (newPhase.trim() !== "") {
      setPhases([...phases, newPhase]);
      setNewPhase("");
    }
  };

  const handleRemovePhase = (index: number) => {
    const newPhases = [...phases];
    newPhases.splice(index, 1);
    setPhases(newPhases);
  };

  const handleSubmit = (data: any) => {
    const formData = { ...data, phases };
    console.log("Submitting journey settings:", formData);
    toast.success("Configurações da jornada atualizadas com sucesso!");
  };

  if (isLoading) {
    return <div className="p-4">Carregando configurações...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="phases">Fases</TabsTrigger>
              <TabsTrigger value="groups">Grupos</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="journeyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Jornada</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da jornada" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Início</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale: ptBR,
                                    })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Término</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale: ptBR,
                                    })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">Salvar alterações</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="phases" className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {phases.map((phase, index) => (
                    <Badge key={index} className="text-sm">
                      {phase}
                      <button
                        type="button"
                        onClick={() => handleRemovePhase(index)}
                        className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nova fase"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    onClick={handleAddPhase}
                    size="sm"
                    className="shrink-0"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <Button onClick={handleSubmit}>Salvar fases</Button>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="maxGroupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho máximo do grupo</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="enableMentoring"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Habilitar mentoria</FormLabel>
                          <FormDescription>
                            Permitir que mentores sejam atribuídos a grupos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Salvar alterações</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneySettings;
