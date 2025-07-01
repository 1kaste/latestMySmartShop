

import React, { useState, useMemo } from 'react';
import { Product, Category } from '../../data/mock-data';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Icons } from '../../components/icons';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';

const InventoryPage: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'category' | null>(null);
  const [currentItem, setCurrentItem] = useState<Product | Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const openModal = (type: 'product' | 'category', item: Product | Category | null = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setCurrentItem(null);
  };

  const handleProductSave = (product: Product) => {
    if (currentItem && 'stock' in currentItem) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    closeModal();
  };
  
  const handleCategorySave = (category: Category) => {
    if (currentItem && !('stock' in currentItem)) {
      updateCategory(category);
    } else {
      addCategory({ ...category, imageUrl: 'https://picsum.photos/seed/newcat/400/400' });
    }
    closeModal();
  };

  const handleDelete = (type: 'product' | 'category', id: string) => {
    if(window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        if (type === 'product') {
            deleteProduct(id);
        } else {
            // Optional: check if products are using this category before deleting
            const productsInCategory = products.filter(p => p.category === categories.find(c => c.id === id)?.name);
            if (productsInCategory.length > 0) {
                alert(`Cannot delete category. ${productsInCategory.length} product(s) are currently using it.`);
                return;
            }
            deleteCategory(id);
        }
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary-dark dark:text-white">Inventory Management</h1>

      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Add, edit, or delete products from your store.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-xs">
                    <Input 
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                </div>
                <Button onClick={() => openModal('product')}>
                    <Icons.PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <ProductTable products={filteredProducts} onEdit={(p) => openModal('product', p)} onDelete={(id) => handleDelete('product', id)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Categories</CardTitle>
           <Button onClick={() => openModal('category')}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} onEdit={(c) => openModal('category', c)} onDelete={(id) => handleDelete('category', id)} />
        </CardContent>
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === 'product' && <ProductForm product={currentItem as Product | null} onSave={handleProductSave} onCancel={closeModal} categories={categories} />}
          {modalType === 'category' && <CategoryForm category={currentItem as Category | null} onSave={handleCategorySave} onCancel={closeModal} />}
        </Modal>
      )}
    </div>
  );
};

// --- Sub-components for Inventory Page ---

const ProductTable: React.FC<{ products: Product[], onEdit: (p: Product) => void, onDelete: (id: string) => void }> = ({ products, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">Product Name</th>
          <th scope="col" className="px-6 py-3">Category</th>
          <th scope="col" className="px-6 py-3">Stock</th>
          <th scope="col" className="px-6 py-3">Price</th>
          <th scope="col" className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{p.name}</td>
            <td className="px-6 py-4">{p.category}</td>
            <td className={`px-6 py-4 font-bold ${p.stock < 10 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{p.stock}</td>
            <td className="px-6 py-4">Ksh {p.price.toLocaleString()}</td>
            <td className="px-6 py-4 text-right space-x-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(p)}><Icons.Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)}><Icons.Trash2 className="h-4 w-4 text-red-500" /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
     {products.length === 0 && (
      <p className="text-center py-8 text-gray-500">No products found matching your search.</p>
    )}
  </div>
);

const CategoryTable: React.FC<{ categories: Category[], onEdit: (c: Category) => void, onDelete: (id: string) => void }> = ({ categories, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">Category Name</th>
          <th scope="col" className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(c => (
          <tr key={c.id} className="bg-white border-b dark:bg-primary-dark dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{c.name}</td>
            <td className="px-6 py-4 text-right space-x-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(c)}><Icons.Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(c.id)}><Icons.Trash2 className="h-4 w-4 text-red-500" /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductForm: React.FC<{ product: Product | null, onSave: (p: Product) => void, onCancel: () => void, categories: Category[] }> = ({ product, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(product || { name: '', price: 0, imageUrls: [], category: '', colors: [], stock: 0, description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        if (name === 'price' || name === 'stock') {
            return {...prev, [name]: parseInt(value, 10) || 0 };
        }
        if (name === 'colors' || name === 'imageUrls') {
            return {...prev, [name]: value.split(',').map(s => s.trim()).filter(Boolean) };
        }
        return {...prev, [name]: value };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({...(formData as Product), id: product?.id || ''});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
      <div><label className="font-medium">Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      
      <div className="grid grid-cols-2 gap-4">
        <div><label className="font-medium">Price (Ksh)</label><Input name="price" type="number" value={formData.price} onChange={handleChange} required /></div>
        <div><label className="font-medium">Stock</label><Input name="stock" type="number" value={formData.stock} onChange={handleChange} required /></div>
      </div>
      
      <div>
        <label className="font-medium">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-900/50 dark:border-gray-600 dark:text-white">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

       <div>
        <label className="font-medium">Colors</label>
        <Input name="colors" value={formData.colors.join(', ')} onChange={handleChange} placeholder="e.g. Red, Blue, Green" />
        <p className="text-xs text-gray-500 mt-1">Separate color names with a comma.</p>
       </div>

       <div>
        <label className="font-medium">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"/>
       </div>

       <div>
        <label className="font-medium">Image URLs</label>
        <textarea name="imageUrls" value={formData.imageUrls.join(',\n')} onChange={handleChange} required rows={4} className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal dark:bg-gray-900/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"/>
        <p className="text-xs text-gray-500 mt-1">Separate URLs with a comma. The first URL will be the main image.</p>
       </div>

      <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-primary-dark py-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  )
};

const CategoryForm: React.FC<{ category: Category | null, onSave: (c: Category) => void, onCancel: () => void }> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Category>>(category || { name: '', imageUrl: '' });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Category);
  };
  
  return (
     <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-primary-dark dark:text-white">{category ? 'Edit Category' : 'Add New Category'}</h2>
      <div><label>Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      <div><label>Image URL</label><Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required /></div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  )
};

export default InventoryPage;
