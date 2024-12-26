import CitiesTable from "@/components/settings/cities-table";
import ModelsTable from "@/components/settings/models-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Settings = () => {
  return (
    <div className="p-8 mt-8 bg-white mx-auto container rounded-2xl">
      <Tabs defaultValue="city">
        <TabsList className="max-w-[400px] w-full grid grid-cols-2">
          <TabsTrigger value="city">Регионы</TabsTrigger>
          <TabsTrigger value="model">Бренды</TabsTrigger>
        </TabsList>
        <TabsContent value="city">
          <CitiesTable />
        </TabsContent>
        <TabsContent value="model">
          <ModelsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
