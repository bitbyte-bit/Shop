let items = [];
let sortByLatest = true;
let showAllItems = false;

    function loadItems() {
       const saved = localStorage.getItem('shoppingList');
       if (saved) {
         items = JSON.parse(saved);
         items.forEach(item => {
           if (!item.date) item.date = new Date();
           if (item.editing === undefined) item.editing = false;
         });
       }
}

    function saveItems() {
       localStorage.setItem('shoppingList', JSON.stringify(items));
}


    function addItem() {
      const name = document.getElementById('newItemName').value.trim();
      const price = parseFloat(document.getElementById('newItemPrice').value);
      const quantity = parseInt(document.getElementById('newItemQuantity').value) || 1;
      const category = document.getElementById('newItemCategory').value;
      if (!name || isNaN(price)) return;

      items.push({ name, price, category, checked: false, quantity, date: new Date(), editing: false});
      saveItems();
      renderList();

      document.getElementById('newItemName').value = '';
    		document.getElementById('newItemPrice').value = '';
      document.getElementById('newItemQuantity').value = '1';
}

    function renderList() {
       const list = document.getElementById('list');
       list.innerHTML = '';
       const sortedItems = sortByLatest ? [...items].sort((a, b) => new Date(b.date) - new Date(a.date)) : items;
       const itemsToShow = showAllItems ? sortedItems : sortedItems.slice(0, 4);
       itemsToShow.forEach((item) => {
        const originalIndex = items.indexOf(item);
        const div = document.createElement('div');
        div.className = item.editing ? 'item editing' : 'item';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = item.name;

        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.value = item.price.toFixed(1);
        priceInput.min = '0';
        priceInput.step = '0.01';

        const categorySelect = document.createElement('select');
        ["Groceries", "Electronics", "Clothing", "Other"].forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          if (item.category === cat) opt.selected = true;
          categorySelect.appendChild(opt);
        });

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity || 1;
        quantityInput.min = '1';

        const nameSpan = document.createElement('h3');
        nameSpan.textContent = item.name;
        nameSpan.className='item-name';
        const priceSpan = document.createElement('span');
        priceSpan.textContent = 'Price: UGX ' + item.price.toFixed(1);
        priceSpan.className='item-price';
        const categorySpan = document.createElement('span');
        categorySpan.className='item-category';
        categorySpan.textContent = item.category;
        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = 'Qty: ' + (item.quantity || 1);
        quantitySpan.className='item-quantity';
        const totalSpan = document.createElement('span');
        totalSpan.textContent = 'Total: UGX ' + (item.price * (item.quantity || 1)).toFixed(1);
        totalSpan.className='item-total';

        if (item.checked) {
          nameSpan.style.textDecoration = 'line-through';
          priceSpan.style.textDecoration = 'line-through';          
          totalSpan.style.textDecoration = 'line-through';
        }

        const checkBtn = document.createElement('button');
        checkBtn.textContent = item.checked? 'Unmark': 'Mark as bought';
        checkBtn.onclick = () => {
          items[originalIndex].checked =!items[originalIndex].checked;
          saveItems();
          updateTotals();
          renderList();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete item';
        deleteBtn.onclick = () => {
           items.splice(originalIndex, 1);
           saveItems();
           updateTotals();
           renderList();
        };

        if (item.editing) {
          div.appendChild(nameInput);
          div.appendChild(priceInput);
          div.appendChild(categorySelect);
          div.appendChild(quantityInput);
        } else {
          div.appendChild(nameSpan);
          div.appendChild(priceSpan);
          div.appendChild(categorySpan);
          div.appendChild(quantitySpan);
          div.appendChild(totalSpan);
        }

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.className = 'save-btn';
        saveBtn.onclick = () => {
          items[originalIndex].name = nameInput.value;
          items[originalIndex].price = parseFloat(priceInput.value);
          items[originalIndex].category = categorySelect.value;
          items[originalIndex].quantity = parseInt(quantityInput.value) || 1;
          items[originalIndex].editing = false;
          saveItems();
          updateTotals();
          renderList();
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          // Close all other editing
          items.forEach((i, idx) => {
            if (idx !== originalIndex) i.editing = false;
          });
          items[originalIndex].editing = true;
          renderList();
        };

        div.appendChild(checkBtn);
        div.appendChild(deleteBtn);
        if (item.editing) {
          div.appendChild(saveBtn);
        } else {
          div.appendChild(editBtn);
        }
        list.appendChild(div);
});

if (sortedItems.length > 4) {
  if (!showAllItems) {
    const viewMoreBtn = document.createElement('button');
    viewMoreBtn.textContent = 'View More';
    viewMoreBtn.onclick = () => { showAllItems = true; renderList(); };
    list.appendChild(viewMoreBtn);
  } else {
    const viewLessBtn = document.createElement('button');
    viewLessBtn.textContent = 'View Less';
    viewLessBtn.onclick = () => { showAllItems = false; renderList(); };
    list.appendChild(viewLessBtn);
  }
}

updateTotals();
}

    function updateTotals() {
       const checkedTotal = items.filter(i => i.checked).reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
       const listTotal = items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
       document.getElementById('checkedTotal').textContent = `${checkedTotal.toFixed(1)} (${items.filter(i => i.checked).length} items)`;
       document.getElementById('listTotal').textContent = `${listTotal.toFixed(1)} (${items.length} items)`;
       document.getElementById('checkedTotalCard').style.display = checkedTotal> 0? 'block': 'none';
}

    function shareApp() {
      navigator.clipboard.writeText(window.location.href="https://orionhub.netlify.app/").then(() => {
        alert("App link copied to clipboard!");
});
}

    function openInApp() {
      if (window.matchMedia('(window.location.href="https://orionhub.netlify.app/")').matches) {
        alert("You're already using the app!");
} else {
        window.location.href="https://orionhub.netlify.app/";
}
}

    async function exportToPDF() {
      const { jsPDF} = window.jspdf;
      const doc = new jsPDF({ format: "a4"});
      doc.setFontSize(16);
      doc.text("Full Shopping List", 30, 30);
      let y = 50;
      items.forEach(item => {
        const qty = item.quantity || 1;
        const total = item.price * qty;
        doc.setFontSize(12);
        doc.text(`• ${item.name} - Qty: ${qty} - Price: UGX${item.price.toFixed(1)} - Total: UGX${total.toFixed(1)} (${item.category})`, 30, y);
        y += 10;
});
      const date = new Date();
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = date.toLocaleTimeString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${dateStr}, ${timeStr}`, 30, 270 );
      doc.save("shopping-list.pdf");
}

    async function createReceipt() {
       const checkedItems = items.filter(item => item.checked);
       if (checkedItems.length === 0) {
         alert("No items are checked.");
         return;
}
       document.getElementById('receiptModal').style.display = 'block';
}

    function downloadReceipt() {
       const { jsPDF} = window.jspdf;
       const doc = new jsPDF({ format: "a4"});
       doc.setFontSize(16);
       doc.text("Receipt From ORION", 30, 30);
       doc.setFontSize(12);
       let y = 50;
       const checkedItems = items.filter(item => item.checked);

       // Table headers
       doc.text("Item", 30, y);
       doc.text("Category", 80, y);
       doc.text("Qty", 130, y);
       doc.text("Price", 150, y);
       doc.text("Total", 180, y);
       y += 10;

       doc.setLineWidth(0.5);
       doc.line(30, y, 200, y);
       y += 10;

       let total = 0;
       checkedItems.forEach(item => {
         const qty = item.quantity || 1;
         const itemTotal = item.price * qty;
         doc.text(item.name, 30, y);
         doc.text(item.category, 80, y);
         doc.text(qty.toString(), 130, y);
         doc.text(item.price.toFixed(1), 150, y);
         doc.text(itemTotal.toFixed(1), 180, y);
         total += itemTotal;
         y += 10;
});

       y += 10;
       doc.setFontSize(14);
       doc.text(`Total: UGX${total.toFixed(1)}`, 30, y);

       const date = new Date();
       const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
       const timeStr = date.toLocaleTimeString();
       doc.setFontSize(10);
       doc.text(`Generated on: ${dateStr}, ${timeStr}`, 30, 270);

       doc.save("orion receipts.pdf");
       closeReceiptModal();
}

    function showWhatsAppInput() {
       closeReceiptModal();
       document.getElementById('whatsappModal').style.display = 'block';
}

    function sendToWhatsApp() {
       const number = document.getElementById('whatsappNumber').value.trim();
       if (!number) {
         alert("Please enter a phone number.");
         return;
}
       const checkedItems = items.filter(item => item.checked);
       let message = "Receipt From ORION\n\n";
       let total = 0;
       checkedItems.forEach(item => {
         const qty = item.quantity || 1;
         const itemTotal = item.price * qty;
         message += `${item.name} - Qty: ${qty} - Price: UGX${item.price.toFixed(1)} - Total: UGX${itemTotal.toFixed(1)} (${item.category})\n`;
         total += itemTotal;
});
       message += `\nTotal: UGX${total.toFixed(1)}`;

       const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
       window.open(url, '_blank');
       closeWhatsAppModal();
}

    function closeReceiptModal() {
       document.getElementById('receiptModal').style.display = 'none';
}

    function closeWhatsAppModal() {
       document.getElementById('whatsappModal').style.display = 'none';
}

    loadItems();
    renderList();

