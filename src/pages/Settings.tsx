
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveriesSettings from "@/components/settings/DeliveriesSettings";
import JourneySettings from "@/components/settings/JourneySettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, FileText, BookOpen, LayoutGrid } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2"
        >
          <SettingsIcon className="h-6 w-6 text-green-700" />
          <h1 className="text-2xl font-bold text-green-800">Configurações</h1>
        </motion.div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <FileText className="h-4 w-4 mr-2" />
              Entregas
            </TabsTrigger>
            <TabsTrigger value="journey" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <BookOpen className="h-4 w-4 mr-2" />
              Jornada
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <TabsContent value="general" className="p-0 mt-0">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="deliveries" className="p-0 mt-0">
              <DeliveriesSettings />
            </TabsContent>
            
            <TabsContent value="journey" className="p-0 mt-0">
              <JourneySettings />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
