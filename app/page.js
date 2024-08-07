'use client';
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Stack, TextField, Typography, Button, Modal, Container, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); 
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemType, setItemType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id, 
        ...doc.data()
      })
    });
    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, description, type } = docSnap.data();
      await updateDoc(docRef, {
        quantity: quantity + 1,
        description: itemDescription,
        type: itemType
      });
    } else {
      await setDoc(docRef, {
        quantity: 1,
        description: itemDescription,
        type: itemType
      });
    }

    await updateInventory();
  }

  const incrementItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (typeFilter ? item.type === typeFilter : true)
  );

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: "40px", textAlign: "center" }}>
        Inventory Management
      </Typography>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />

      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          label="Filter by Type"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Hardware">Hardware</MenuItem>
          <MenuItem value="Software">Software</MenuItem>
          <MenuItem value="Consumables">Consumables</MenuItem>
        </Select>
      </FormControl>

      <Stack
        direction="column"
        spacing={2}
        sx={{
          width: "100%",
          maxHeight: "50vh",
          overflowY: "auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {filteredInventory.map(item => (
          <Box
            key={item.name}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="10px"
            borderBottom="1px solid #ddd"
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h6">{item.name} (Type: {item.type})</Typography>
              <Typography variant="body2" color="textSecondary">Description: {item.description}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6" sx={{ marginRight: "20px" }}>
                {item.quantity}
              </Typography>
              <Button variant="outlined" onClick={() => incrementItem(item.name)}>+</Button>
              <Button variant="outlined" onClick={() => removeItem(item.name)}>-</Button>
            </Box>
          </Box>
        ))}
      </Stack>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          height: "100px",
          width: "100px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "15px 30px",
          borderRadius: "50%",
          backgroundColor: "#1976d2",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#115293",
          },
        }}
      >
        New
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography>Add Items</Typography>
          <TextField
            variant="outlined"
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Description"
            fullWidth
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              label="Type"
            >
              <MenuItem value="Hardware">Hardware</MenuItem>
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="Consumables">Consumables</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              setItemDescription('');
              setItemType('');
              handleClose();
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
