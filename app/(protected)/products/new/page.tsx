import { NewProduct } from "@/features/products/components";
import { PageHeader } from "@/components";

export default function NewProductPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <PageHeader
                title="Create New Product"
                description="Add a new product to your inventory"
            />
            <NewProduct />
        </div>
    );
}
