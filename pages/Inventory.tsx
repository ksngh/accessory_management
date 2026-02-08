
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProducts } from '../src/api/products';
import { getSuppliers } from '../src/api/suppliers';
import { Product, Supplier } from '../types';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number>(0);
  const [rows, setRows] = useState<Product[][]>([]);
  
  const dragItem = useRef<{ rowIndex: number; colIndex: number } | null>(null);
  const dragOverItem = useRef<{ rowIndex: number; colIndex: number } | null>(null);
  const scrollContainerRef = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
        if (suppliersData.length > 0) {
          setSelectedSupplier(suppliersData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      }
    };
    fetchSuppliersData();
  }, []);

  useEffect(() => {
    if (!selectedSupplier) return;

    const fetchProducts = async () => {
      try {
        const productsData = await getProducts({ supplierId: selectedSupplier });
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [selectedSupplier]);

  useEffect(() => {
    const chunked: Product[][] = [];
    for (let i = 0; i < products.length; i += 6) {
      chunked.push(products.slice(i, i + 6));
    }
    if (chunked.length === 0) chunked.push([]);
    setRows(chunked);
  }, [products]);

  const addRow = () => {
    setRows(prev => [...prev, []]);
  };

  const handleSort = () => {
    if (!dragItem.current || !dragOverItem.current) return;
    
    const newRows = [...rows.map(r => [...r])];
    const { rowIndex: fromRow, colIndex: fromCol } = dragItem.current;
    const { rowIndex: toRow, colIndex: toCol } = dragOverItem.current;

    const [movedItem] = newRows[fromRow].splice(fromCol, 1);
    newRows[toRow].splice(toCol, 0, movedItem);

    setRows(newRows);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent, rowIndex: number) => {
    e.preventDefault();
    const container = scrollContainerRef.current[rowIndex];
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 50) container.scrollLeft -= 10;
      else if (x > rect.width - 50) container.scrollLeft += 10;
    }
  };

  return (
    <Layout>
      <div className="sticky top-16 bg-background-light/95 backdrop-blur-md z-40 border-b border-primary/10 py-4 px-5">
        <div className="relative group">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">거래처 선택</label>
          <select 
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(parseInt(e.target.value, 10))}
            className="w-full h-12 pl-4 pr-10 rounded-2xl border border-primary/30 bg-white font-bold text-sm text-primary-text focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-6 space-y-10 pb-40">
        <div className="space-y-12">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="space-y-4">
              <div className="px-5 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary-dark/30 uppercase tracking-tighter">LINE {rowIndex + 1}</span>
              </div>
              
              <div 
                ref={el => { scrollContainerRef.current[rowIndex] = el; }}
                className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-2 min-h-[140px] scroll-smooth"
                onDragOver={(e) => handleDragOver(e, rowIndex)}
              >
                {row.map((product, colIndex) => (
                  <div 
                    key={product.id}
                    draggable
                    onDragStart={() => (dragItem.current = { rowIndex, colIndex })}
                    onDragEnter={() => (dragOverItem.current = { rowIndex, colIndex })}
                    onDragEnd={handleSort}
                    className="shrink-0 w-28 flex flex-col gap-2 group animate-in fade-in zoom-in-95 duration-300"
                  >
                    <div className="relative aspect-square">
                      <div 
                        className="w-full h-full rounded-[1.8rem] shadow-md border border-primary/10 bg-center bg-cover bg-white overflow-hidden transition-all group-active:scale-90 group-active:rotate-2 cursor-grab active:cursor-grabbing"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/stock/edit/${product.id}`);
                        }}
                        className="absolute -top-1 -right-1 size-8 bg-white rounded-full shadow-lg border border-primary/20 flex items-center justify-center text-primary-dark active:scale-90 transition-all z-10"
                      >
                        <span className="material-symbols-outlined text-base font-bold">edit_note</span>
                      </button>

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/95 backdrop-blur-sm rounded-lg text-[8px] font-black text-primary-text border border-primary/20 shadow-sm">
                        재고 {product.stock}
                      </div>
                    </div>

                    <div className="px-1 text-center">
                      <p className="text-primary-text font-black text-[11px]">₩{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div 
                  className="shrink-0 w-16 border-2 border-dashed border-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary/30"
                  onDragEnter={() => {
                    if (dragItem.current) {
                      dragOverItem.current = { rowIndex, colIndex: row.length };
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5">
          <button 
            onClick={addRow}
            className="w-full py-5 flex items-center justify-center gap-3 border-2 border-dashed border-primary/30 rounded-[2rem] text-primary-dark font-black bg-white/50 hover:bg-primary/5 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            행 추가
          </button>
        </div>
      </div>

      <div className="fixed bottom-28 right-6 z-[60]">
        <button 
          onClick={() => navigate('/product/add')}
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-text shadow-lg active:scale-95 transition-all border-4 border-white"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </div>
    </Layout>
  );
};

export default Inventory;
