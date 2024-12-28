import CitiesTable from "@/components/settings/cities-table";
import ModelsTable from "@/components/settings/models-table";
import UserManagement from "@/components/settings/users/user-create-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Settings = () => {
  return (
    <div className="p-8 mt-8 bg-white mx-auto container rounded-2xl">
      <Tabs defaultValue="city">
        <TabsList className="max-w-[600px] w-full grid grid-cols-3">
          <TabsTrigger value="city">Регионы</TabsTrigger>
          <TabsTrigger value="model">Бренды</TabsTrigger>
          <TabsTrigger value="user">Пользователи</TabsTrigger>
        </TabsList>
        <TabsContent value="city">
          <CitiesTable />
        </TabsContent>
        <TabsContent value="model">
          <ModelsTable />
        </TabsContent>
        <TabsContent value="user">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
