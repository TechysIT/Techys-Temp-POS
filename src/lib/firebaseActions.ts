"use server"

import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "@firebase/firestore";
import {fireStore} from "@/lib/firebase";


export async function getInvoiceNo() {
    const q = query(collection(fireStore, "Orders"), orderBy("createdAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    return Number(querySnapshot.docs[0].data().invoiceNo) + 1;
}

export async function AddToDB(formData: {
    invoiceNo: string;
    createdAt: Date | undefined;
    preparedBy: string;
    paidBy: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    issue: string;
    discount: number | string;
    subTotal: number;
    vat: number;
    total: number;
    paid: number | string;
    change: number;
    balance: number;
}, items: {
    name: string;
    description: string;
    quantity: number;
    total: number;
    price: number
}[]) {
    try {
        const q = query(collection(fireStore, "Orders"), where("invoiceNo", "==", formData.invoiceNo));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            const docRef = await addDoc(collection(fireStore, "Orders"), {
                invoiceNo: formData.invoiceNo,
                createdAt: serverTimestamp(),
                preparedBy: formData.preparedBy,
                paidBy: formData.paidBy,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                issue: formData.issue,
                discount: formData.discount,
                subTotal: formData.subTotal,
                vat: formData.vat,
                total: formData.total,
                paid: formData.paid,
                change: formData.change,
                balance: formData.balance,
                items: items
            });
            if (docRef.id) return true
        } else {
            await updateDoc(doc(fireStore, "Orders", querySnapshot.docs[0].id), {
                invoiceNo: formData.invoiceNo,
                createdAt: formData.createdAt,
                updatedOn: serverTimestamp(),
                preparedBy: formData.preparedBy,
                paidBy: formData.paidBy,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                issue: formData.issue,
                discount: formData.discount,
                subTotal: formData.subTotal,
                vat: formData.vat,
                total: formData.total,
                paid: formData.paid,
                change: formData.change,
                balance: formData.balance,
                items: items
            });
            return true
        }
    } catch (error) {
        console.log(error)
        return false
    }
}


export async function getOrderData(invoiceNo: string) {
    try {
        const q = query(collection(fireStore, "Orders"), where("invoiceNo", "==", invoiceNo));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return {error: "Not Found", result: false}
        return {result: true, data: querySnapshot.docs[0].data()}
    } catch (error: any) {
        return {error: error.message, result: false}
    }

}