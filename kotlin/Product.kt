class Product(
    val id: Int,
    val name: String,
    var price: Double,
    val category: String,
    var stock: Int?
)

fun stockLabel(stock: Int?): String {
    return when {
        stock == null -> "Sin dato"
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    return price * (100 - percent) / 100
}

fun main() {
    val products = listOf(
        Product(1, "Agua 600 ml", 2500.0, "Bebidas", 24),
        Product(2, "Papas fritas", 3800.0, "Snacks", 0),
        Product(3, "Jabón líquido", 12000.0, "Aseo", null)
    )

    for (p in products) {
        val label = stockLabel(p.stock)
        val discounted = applyDiscount(p.price, 10)
        println("${p.name} | $label | precio con 10 % de descuento: $discounted")
    }
}