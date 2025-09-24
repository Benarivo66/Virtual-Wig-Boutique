import CreateProductForm from '@/app/ui/CreateProductForm';

export default async function CreatePage() {
    return (<div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Add a wig</h1>
        <CreateProductForm />
    </div>
    )
}