
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "../../services/api";

const formSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransferForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
      currency: "KZT",
    },
  });
  
  const mutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      form.reset();
    },
  });
  
  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Send Money</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Recipient</label>
          <input
            {...form.register("recipient")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Recipient address or account"
          />
          {form.formState.errors.recipient && (
            <p className="text-sm text-red-500">{form.formState.errors.recipient.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Amount</label>
          <input
            {...form.register("amount", { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Currency</label>
          <select
            {...form.register("currency")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="KZT">KZT (Tenge)</option>
            <option value="CBDC_KZT">CBDC Tenge</option>
            <option value="RUB">RUB (Ruble)</option>
            <option value="USD">USD (Dollar)</option>
            <option value="ETH">ETH (Ethereum)</option>
          </select>
          {form.formState.errors.currency && (
            <p className="text-sm text-red-500">{form.formState.errors.currency.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Processing..." : "Send Transfer"}
        </button>
      </form>
    </div>
  );
}
