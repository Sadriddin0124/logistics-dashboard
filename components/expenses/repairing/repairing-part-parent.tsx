import { useForm, FormProvider } from "react-hook-form";
import RepairingPartChild from "./repairing-part-child";

interface PartField {
  name: string;
  id: string;
  price: string;
  status: boolean
}

interface PartsFormData {
  parts: PartField[];
}

export default function RepairingPartsForm() {
  const methods = useForm<PartsFormData>({
    defaultValues: {
      parts: [{ name: "", id: "", price: "", status: false }],
    },
  });

  const onSubmit = (data: PartsFormData) => {
    console.log(data);
  };

  return (
    <div className="p-8 mt-8 rounded-2xl bg-white container mx-auto">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold">Запчасти для автомобиля</h2>

          {/* Render the child component for managing parts */}
          <RepairingPartChild />

          <div className="flex gap-4">
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
