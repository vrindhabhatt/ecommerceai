import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 100 },
];

export default function EcommerceApp() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const sendMessage = async () => {
    if (!message) return;
    setChatHistory([...chatHistory, { role: "user", text: message }]);
    
    const response = await fetch("https://your-api-gateway.amazonaws.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setChatHistory([...chatHistory, { role: "user", text: message }, { role: "bot", text: data.reply }]);
    setMessage("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">E-Commerce Store</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <CardContent>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <Button onClick={() => addToCart(product)}>Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        {cart.length > 0 ? (
          cart.map((item, index) => <p key={index}>{item.name} - ${item.price}</p>)
        ) : (
          <p>No items in cart</p>
        )}
      </div>
      
      <div className="p-4 border rounded-xl w-96">
        <h2 className="text-xl font-bold">Chatbot</h2>
        <div className="h-40 overflow-y-auto border p-2">
          {chatHistory.map((msg, index) => (
            <p key={index} className={msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-600"}>
              {msg.text}
            </p>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask me anything..." />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
