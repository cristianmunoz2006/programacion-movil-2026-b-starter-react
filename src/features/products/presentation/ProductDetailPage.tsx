import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView } from '../domain/product';
import type { Product } from '../domain/product';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 * Estado local con useState + useEffect (ADR-001); llama directo a data/products-api.ts (ADR-002).
 */
const ProductDetailPage: React.FC = () => {
  const productId = Number(useParams<{ id: string }>().id);
  const history = useHistory();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setConfirmingDelete(false);
    getProduct(productId)
      .then(setProduct)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      history.push('/productos');
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="ion-text-center ion-padding">
          <IonSpinner />
          <p>Cargando producto…</p>
        </div>
      );
    }

    if (error !== null || product === null) {
      return (
        <div className="ion-padding">
          <h2>No se pudo cargar</h2>
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        </div>
      );
    }

    const view = toProductView(product);
    const badgeColor = view.isOutOfStock ? 'danger' : view.isLowStock ? 'warning' : 'success';

    return (
      <>
        <IonList>
          <IonItem>
            <IonLabel>
              <p>Id</p>
              <h2>{product.id}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Nombre</p>
              <h2>{product.name}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Categoría</p>
              <h2>{product.category}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Precio</p>
              <h2>{view.priceLabel}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Stock</p>
              <h2>{product.stock}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Disponibilidad</p>
            </IonLabel>
            <IonBadge color={badgeColor} slot="end">
              {view.stockLabel}
            </IonBadge>
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton routerLink={`/productos/${productId}/editar`}>Editar</IonButton>
          {confirmingDelete ? (
            <div>
              <IonText>
                <p>¿Eliminar este producto?</p>
              </IonText>
              <IonButton color="danger" onClick={handleDelete}>
                Confirmar
              </IonButton>
              <IonButton fill="outline" onClick={() => setConfirmingDelete(false)}>
                Cancelar
              </IonButton>
            </div>
          ) : (
            <IonButton color="danger" fill="outline" onClick={() => setConfirmingDelete(true)}>
              Eliminar
            </IonButton>
          )}
        </div>
      </>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{renderBody()}</IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;