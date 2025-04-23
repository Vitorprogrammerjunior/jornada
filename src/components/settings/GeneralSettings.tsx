
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const GeneralSettings = () => {
  const form = useForm();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["generalSettings"],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            siteName: "Jornada Fluxo Digital",
            siteDescription: "Plataforma para acompanhamento e gestão da jornada de aprendizagem",
            adminEmail: "admin@jornada.com",
            supportEmail: "suporte@jornada.com",
          });
        }, 1000);
      });
    },
    meta: {
      onSuccess: (data: any) => {
        console.log("Settings loaded successfully:", data);
        form.reset(data);
      },
      onError: (error: any) => {
        toast.error("Erro ao carregar configurações gerais");
      }
    }
  });

  const handleSubmit = (data: any) => {
    console.log("Submitting general settings:", data);
    toast.success("Configurações gerais atualizadas com sucesso!");
  };

  if (isLoading) {
    return <div className="p-4">Carregando configurações...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Site</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do site" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Site</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite uma breve descrição do site"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Administrador</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@exemplo.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Suporte</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="suporte@exemplo.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar alterações</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
