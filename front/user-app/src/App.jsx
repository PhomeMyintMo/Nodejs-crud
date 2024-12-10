import React, { useEffect, useState } from 'react';

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((products) => (
                    <li key={products.id}>
                        {products.name} - ${products.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
