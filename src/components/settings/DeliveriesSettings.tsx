
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DeliveriesSettings = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const form = useForm();

  const { data: deliverySettings, isLoading } = useQuery({
    queryKey: ["deliverySettings"],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            enablePeerReview: true,
            defaultDueTime: "23:59",
            reminderHours: 24,
            allowLateSubmissions: true,
            lateSubmissionsPenalty: 10,
          });
        }, 1000);
      });
    },
    meta: {
      onSuccess: (data: any) => {
        console.log("Settings loaded successfully:", data);
      },
      onError: (error: any) => {
        toast.error("Erro ao carregar configurações de entregas");
      }
    }
  });

  const handleSubmit = (data: any) => {
    console.log("Submitting delivery settings:", data);
    toast.success("Configurações de entregas atualizadas com sucesso!");
  };

  if (isLoading) {
    return <div className="p-4">Carregando configurações...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="enablePeerReview"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Avaliação entre pares</FormLabel>
                          <FormDescription>
                            Permitir que os alunos avaliem as entregas uns dos outros
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

            <TabsContent value="notifications" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="defaultDueTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário padrão de entregas</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="reminderHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lembrete antes do prazo (horas)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Quantas horas antes do prazo o sistema deve enviar um lembrete
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Salvar alterações</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="allowLateSubmissions"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Permitir entregas atrasadas</FormLabel>
                          <FormDescription>
                            Permitir que os alunos enviem entregas após o prazo
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

                  <FormField
                    name="lateSubmissionsPenalty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penalidade para entregas atrasadas (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Porcentagem de desconto na nota para entregas atrasadas
                        </FormDescription>
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

export default DeliveriesSettings;
