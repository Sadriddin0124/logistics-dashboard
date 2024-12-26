import { useForm, FormProvider } from "react-hook-form";
import RepairingChild from "@/components/expenses/repairing/repairing-child";
import RepairingPartsForm from "@/components/expenses/repairing/repairing-part-parent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PartField {
  name: string;
  id: string;
  price: string;
  status: boolean;
}

interface PartsFormData {
  parts: PartField[];
  amount: string;
  category: string;
  subcategory: string;
  comments: string;
}

export default function PartsParentForm() {
  const methods = useForm<PartsFormData>({
    defaultValues: {
      parts: [{ name: "", id: "", price: "", status: false }],
    },
  });
  const { register, setValue } = methods;

  const onSubmit = (data: PartsFormData) => {
    console.log(data);
  };

  const handleSelectChange = (value: string, key: keyof PartsFormData) => {
    setValue(key, value);
  };

  return (
    <div className="p-8 rounded-2xl bg-white container mx-auto">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold">Запчасти для автомобиля</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className=" grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category*</label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(value, "category")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategory*</label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(value, "subcategory")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount*</label>
                <Input placeholder="Enter amount..." {...register("amount")} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                placeholder="Write your comments here..."
                className="min-h-[120px] resize-none"
                {...register("comments")}
              />
            </div>
          </div>
          {/* Render the child component for managing parts */}
          <RepairingChild />

          <div className="flex gap-4"></div>
        </form>
      </FormProvider>
      <RepairingPartsForm />
    </div>
  );
}
