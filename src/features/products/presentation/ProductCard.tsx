import { IonBadge, IonItem, IonLabel } from '@ionic/react';
import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  /** Producto ya preparado para mostrar (resultado de toProductView). */
  product: ProductView;
  /** Se invoca con el id al tocar la tarjeta. */
  onSelect: (id: number) => void;
}

/**
 * Tarjeta de un producto en la lista. Solo muestra datos y avisa con `onSelect`;
 * no sabe de dónde vienen ni a dónde se navega.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  let badgeColor = 'success';
  if (product.isOutOfStock) badgeColor = 'danger';
  else if (product.isLowStock) badgeColor = 'warning';

  return (
    <IonItem button detail onClick={() => onSelect(product.id)}>
      <IonLabel>
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>{product.priceLabel}</p>
      </IonLabel>
      <IonBadge slot="end" color={badgeColor}>
        {product.stockLabel}
      </IonBadge>
    </IonItem>
  );
};

export default ProductCard;