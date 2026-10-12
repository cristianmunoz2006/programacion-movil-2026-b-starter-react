import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiError, getErrorMessage } from '../data/api-error';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import { CATEGORIES, validateProduct } from '../domain/product';
import type { ProductInput } from '../domain/product';

/**
 * Pantalla: formulario de producto (crear y editar).
 *  - /productos/nuevo          → crear (no hay `id` en la ruta)
 *  - /productos/:id/editar     → editar (precarga con `getProduct`)
 * Estado local con useState + useEffect (ADR-001); llama directo a data/products-api.ts (ADR-002).
 */
const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditing = id !== undefined;
  const productId = Number(id);

  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [category, setCategory] = useState('');
  const [stockText, setStockText] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<{ error: string; details: string[] } | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    setLoadError(null);
    getProduct(productId)
      .then((product) => {
        setName(product.name);
        setPriceText(String(product.price));
        setCategory(product.category);
        setStockText(String(product.stock));
      })
      .catch((e) => setLoadError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [isEditing, productId]);

  // Campo vacío → NaN (Number('') daría 0 y pasaría la validación de stock)
  const toNumber = (text: string) => (text.trim() === '' ? NaN : Number(text));

  const input: ProductInput = {
    name: name.trim(),
    price: toNumber(priceText),
    category,
    stock: toNumber(stockText),
  };
  const validation = validateProduct(input);
  const errors = attempted ? validation.errors : {};

  const handleSave = async () => {
    setAttempted(true);
    setServerError(null);
    if (!validation.isValid) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }
      history.push('/productos');
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        setServerError({ error: e.message, details: e.details });
      } else {
        setServerError({ error: getErrorMessage(e), details: [] });
      }
      setSaving(false);
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

    if (loadError !== null) {
      return (
        <div className="ion-padding">
          <h2>No se pudo cargar</h2>
          <IonText color="danger">
            <p>{loadError}</p>
          </IonText>
        </div>
      );
    }

    return (
      <div className="ion-padding">
        <IonInput
          label="Nombre"
          labelPlacement="floating"
          fill="outline"
          value={name}
          onIonInput={(event) => setName(String(event.detail.value ?? ''))}
        />
        {errors.name && (
          <IonText color="danger">
            <p>{errors.name}</p>
          </IonText>
        )}

        <IonInput
          className="ion-margin-top"
          label="Precio"
          labelPlacement="floating"
          fill="outline"
          type="number"
          value={priceText}
          onIonInput={(event) => setPriceText(String(event.detail.value ?? ''))}
        />
        {errors.price && (
          <IonText color="danger">
            <p>{errors.price}</p>
          </IonText>
        )}

        <div className="ion-margin-top">
          {CATEGORIES.map((item) => (
            <IonButton
              key={item}
              fill={category === item ? 'solid' : 'outline'}
              onClick={() => setCategory(item)}
            >
              {item}
            </IonButton>
          ))}
        </div>
        {errors.category && (
          <IonText color="danger">
            <p>{errors.category}</p>
          </IonText>
        )}

        <IonInput
          className="ion-margin-top"
          label="Stock"
          labelPlacement="floating"
          fill="outline"
          type="number"
          value={stockText}
          onIonInput={(event) => setStockText(String(event.detail.value ?? ''))}
        />
        {errors.stock && (
          <IonText color="danger">
            <p>{errors.stock}</p>
          </IonText>
        )}

        {serverError && (
          <IonText color="danger">
            <p>{serverError.error}</p>
            {serverError.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </IonText>
        )}

        <IonButton className="ion-margin-top" expand="block" disabled={saving} onClick={handleSave}>
          {saving ? 'Guardando…' : 'Guardar'}
        </IonButton>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{renderBody()}</IonContent>
    </IonPage>
  );
};

export default ProductFormPage;