
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PaintBucket, 
  Image, 
  Type, 
  Palette, 
  CheckCircle, 
  Bell, 
  CornerRightDown, 
  Settings,
  Megaphone,
  ScrollText,
  Globe
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

// Mock data for site configuration
interface SiteConfig {
  siteName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  siteDescription: string;
  contactEmail: string;
  showFooter: boolean;
  footerText: string;
  enableNotifications: boolean;
  registrationOpen: boolean;
  requireApproval: boolean;
  maxGroupSize: number;
  language: string;
}

// Mock announcements for homepage
interface Announcement {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  author: string;
  important: boolean;
}

const defaultSiteConfig: SiteConfig = {
  siteName: "Jornada Fluxo Digital",
  logoUrl: "/logo.png",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  siteDescription: "Plataforma para gerenciamento da jornada digital dos alunos",
  contactEmail: "contato@jornadadigital.edu.br",
  showFooter: true,
  footerText: "© 2025 Jornada Fluxo Digital. Todos os direitos reservados.",
  enableNotifications: true,
  registrationOpen: true,
  requireApproval: true,
  maxGroupSize: 5,
  language: "pt-BR"
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Início da nova jornada",
    content: "Temos o prazer de anunciar o início da Jornada Fluxo Digital para este semestre!",
    published: true,
    createdAt: new Date("2025-01-15"),
    author: "Coordenação",
    important: true
  },
  {
    id: "2",
    title: "Prazo de entrega estendido",
    content: "O prazo de entrega da primeira fase foi estendido por mais 5 dias.",
    published: true,
    createdAt: new Date("2025-02-10"),
    author: "Coordenação",
    important: false
  },
  {
    id: "3",
    title: "Rascunho de anúncio",
    content: "Este é um rascunho de anúncio que ainda não foi publicado.",
    published: false,
    createdAt: new Date("2025-02-20"),
    author: "Coordenação",
    important: false
  }
];

const ConfigureSite = () => {
  const { toast } = useToast();
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [activeAnnouncementId, setActiveAnnouncementId] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState<Omit<Announcement, 'id' | 'createdAt' | 'author'>>({
    title: "",
    content: "",
    published: false,
    important: false
  });

  useEffect(() => {
    document.title = "Configurar Site | Jornada Fluxo Digital";
  }, []);

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do site foram atualizadas com sucesso.",
    });
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Erro ao criar anúncio",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = (announcements.length + 1).toString();
    const announcement: Announcement = {
      id: newId,
      ...newAnnouncement,
      createdAt: new Date(),
      author: "Coordenação"
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      published: false,
      important: false
    });

    toast({
      title: "Anúncio criado",
      description: newAnnouncement.published 
        ? "O anúncio foi criado e publicado com sucesso." 
        : "O anúncio foi salvo como rascunho.",
    });
  };

  const handleUpdateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, ...updates } : ann
    ));
    
    toast({
      title: "Anúncio atualizado",
      description: "O anúncio foi atualizado com sucesso.",
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
    setActiveAnnouncementId(null);
    
    toast({
      title: "Anúncio excluído",
      description: "O anúncio foi excluído com sucesso.",
    });
  };

  return (
    <MainLayout requiredRoles={["coordinator"]}>
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-green-800">Configurações do Site</h1>
        </motion.div>

        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <PaintBucket className="h-4 w-4" />
              <span>Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configurações Gerais</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span>Anúncios</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              <span>Rodapé</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Aparência do Site</CardTitle>
                  <CardDescription>
                    Personalize o visual do seu site para refletir a identidade da sua instituição.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="siteName">Nome do Site</Label>
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-slate-500" />
                        <Input 
                          id="siteName" 
                          value={siteConfig.siteName}
                          onChange={(e) => setSiteConfig({...siteConfig, siteName: e.target.value})}
                          placeholder="Nome do Site" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="logoUrl">URL do Logo</Label>
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-slate-500" />
                        <Input 
                          id="logoUrl" 
                          value={siteConfig.logoUrl}
                          onChange={(e) => setSiteConfig({...siteConfig, logoUrl: e.target.value})}
                          placeholder="/logo.png" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-slate-500" />
                        <Input 
                          id="primaryColor" 
                          type="color"
                          value={siteConfig.primaryColor}
                          onChange={(e) => setSiteConfig({...siteConfig, primaryColor: e.target.value})}
                          className="w-full h-10" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-slate-500" />
                        <Input 
                          id="secondaryColor" 
                          type="color"
                          value={siteConfig.secondaryColor}
                          onChange={(e) => setSiteConfig({...siteConfig, secondaryColor: e.target.value})}
                          className="w-full h-10" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="siteDescription">Descrição do Site</Label>
                      <Textarea 
                        id="siteDescription" 
                        value={siteConfig.siteDescription}
                        onChange={(e) => setSiteConfig({...siteConfig, siteDescription: e.target.value})}
                        placeholder="Descrição do Site" 
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveConfig}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Ajuste as configurações gerais do funcionamento da plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="contactEmail">Email de Contato</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        value={siteConfig.contactEmail}
                        onChange={(e) => setSiteConfig({...siteConfig, contactEmail: e.target.value})}
                        placeholder="email@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="language">Idioma</Label>
                      <Select 
                        value={siteConfig.language}
                        onValueChange={(value) => setSiteConfig({...siteConfig, language: value})}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="maxGroupSize">Tamanho Máximo de Grupo</Label>
                      <Input 
                        id="maxGroupSize" 
                        type="number"
                        min={1}
                        max={10}
                        value={siteConfig.maxGroupSize}
                        onChange={(e) => setSiteConfig({...siteConfig, maxGroupSize: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 h-full">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="enableNotifications" className="text-base cursor-pointer">
                          Habilitar Notificações
                        </Label>
                        <p className="text-sm text-slate-500">
                          Enviar notificações para usuários
                        </p>
                      </div>
                      <Switch 
                        id="enableNotifications" 
                        checked={siteConfig.enableNotifications}
                        onCheckedChange={(checked) => setSiteConfig({...siteConfig, enableNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="registrationOpen" className="text-base cursor-pointer">
                          Registro Aberto
                        </Label>
                        <p className="text-sm text-slate-500">
                          Permitir novos registros no site
                        </p>
                      </div>
                      <Switch 
                        id="registrationOpen" 
                        checked={siteConfig.registrationOpen}
                        onCheckedChange={(checked) => setSiteConfig({...siteConfig, registrationOpen: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="requireApproval" className="text-base cursor-pointer">
                          Requer Aprovação
                        </Label>
                        <p className="text-sm text-slate-500">
                          Novos usuários precisam de aprovação
                        </p>
                      </div>
                      <Switch 
                        id="requireApproval" 
                        checked={siteConfig.requireApproval}
                        onCheckedChange={(checked) => setSiteConfig({...siteConfig, requireApproval: checked})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveConfig}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Create New Announcement */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Novo Anúncio</CardTitle>
                  <CardDescription>
                    Crie anúncios para serem exibidos na página inicial do site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="announcementTitle">Título</Label>
                    <Input 
                      id="announcementTitle" 
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      placeholder="Título do anúncio" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="announcementContent">Conteúdo</Label>
                    <Textarea 
                      id="announcementContent" 
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      placeholder="Conteúdo do anúncio" 
                      rows={5}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="announcementImportant" className="cursor-pointer">
                        Destacar como importante
                      </Label>
                      <Switch 
                        id="announcementImportant" 
                        checked={newAnnouncement.important}
                        onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, important: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="announcementPublished" className="cursor-pointer">
                        Publicar imediatamente
                      </Label>
                      <Switch 
                        id="announcementPublished" 
                        checked={newAnnouncement.published}
                        onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, published: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleCreateAnnouncement}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Megaphone className="h-4 w-4 mr-2" />
                      {newAnnouncement.published ? "Publicar Anúncio" : "Salvar como Rascunho"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Announcements List */}
              <Card>
                <CardHeader>
                  <CardTitle>Anúncios Existentes</CardTitle>
                  <CardDescription>
                    Gerencie seus anúncios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.length === 0 ? (
                      <p className="text-center text-slate-500 py-4">
                        Nenhum anúncio criado ainda.
                      </p>
                    ) : (
                      announcements.map(announcement => (
                        <div 
                          key={announcement.id} 
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${
                            announcement.id === activeAnnouncementId 
                              ? 'bg-green-50 border-green-200' 
                              : 'hover:bg-green-50 border-slate-200'
                          }`}
                          onClick={() => setActiveAnnouncementId(
                            announcement.id === activeAnnouncementId ? null : announcement.id
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{announcement.title}</h3>
                            <div className="flex gap-2">
                              {announcement.important && (
                                <Badge className="bg-amber-500">Importante</Badge>
                              )}
                              {announcement.published ? (
                                <Badge className="bg-green-500">Publicado</Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-500 border-slate-300">Rascunho</Badge>
                              )}
                            </div>
                          </div>
                          
                          {announcement.id === activeAnnouncementId && (
                            <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                              <p className="text-sm text-slate-600">{announcement.content}</p>
                              <div className="text-xs text-slate-500">
                                Criado em {announcement.createdAt.toLocaleDateString()}
                              </div>
                              <div className="flex justify-between pt-2">
                                <Button
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAnnouncement(announcement.id);
                                  }}
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                  Excluir
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateAnnouncement(announcement.id, {
                                      published: !announcement.published
                                    });
                                  }}
                                  className={announcement.published 
                                    ? "bg-slate-600 hover:bg-slate-700" 
                                    : "bg-green-600 hover:bg-green-700"
                                  }
                                >
                                  {announcement.published ? "Despublicar" : "Publicar"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Rodapé</CardTitle>
                  <CardDescription>
                    Personalize o rodapé do seu site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="showFooter" className="text-base cursor-pointer">
                        Exibir Rodapé
                      </Label>
                      <p className="text-sm text-slate-500">
                        Mostrar o rodapé em todas as páginas
                      </p>
                    </div>
                    <Switch 
                      id="showFooter" 
                      checked={siteConfig.showFooter}
                      onCheckedChange={(checked) => setSiteConfig({...siteConfig, showFooter: checked})}
                    />
                  </div>
                  
                  {siteConfig.showFooter && (
                    <div className="space-y-3 pt-2">
                      <Label htmlFor="footerText">Texto do Rodapé</Label>
                      <Textarea 
                        id="footerText" 
                        value={siteConfig.footerText}
                        onChange={(e) => setSiteConfig({...siteConfig, footerText: e.target.value})}
                        placeholder="Texto do rodapé" 
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSaveConfig}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ConfigureSite;
