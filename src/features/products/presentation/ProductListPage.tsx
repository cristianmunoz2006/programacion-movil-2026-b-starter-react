import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import { CATEGORIES, filterProducts, toProductView } from '../domain/product';
import type { Product } from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

/**
 * Pantalla: lista de productos (ruta /productos).
 *
 * Carga todo con getProducts() y filtra en memoria con filterProducts().
 * Estados: cargando · error (con «Reintentar») · vacío (la API no tiene productos)
 * · sin resultados (los filtros no encuentran nada).
 * `useIonViewWillEnter` recarga la lista al volver a esta pantalla.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // '' = todas
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir la lista dos veces a la vez
    isLoadingRef.current = true;
    setStatus('loading');
    try {
      setProducts(await getProducts());
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const visibleProducts = filterProducts(products, { search, category }).map(toProductView);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {status === 'loading' && <p className="ion-padding">Cargando productos…</p>}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState title="No hay productos" message="Aún no hay productos registrados." />
        )}

        {status === 'ready' && products.length > 0 && (
          <>
            <IonInput
              className="ion-padding-horizontal"
              type="text"
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
              value={search}
              onIonInput={(event) => setSearch(String(event.detail.value ?? ''))}
            />
            <div className="ion-padding-horizontal">
              <IonButton
                size="small"
                fill={category === '' ? 'solid' : 'outline'}
                onClick={() => setCategory('')}
              >
                Todas
              </IonButton>
              {CATEGORIES.map((name) => (
                <IonButton
                  key={name}
                  size="small"
                  fill={category === name ? 'solid' : 'outline'}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </IonButton>
              ))}
            </div>

            {visibleProducts.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                message="Ningún producto coincide con la búsqueda o la categoría."
              />
            ) : (
              <IonList>
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(id) => history.push(`/productos/${id}`)}
                  />
                ))}
              </IonList>
            )}
          </>
        )}

        <IonButton routerLink="/productos/nuevo" className="ion-margin">
          Nuevo producto
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;