import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFDocument } from 'pdf-lib';
import { Buffer } from 'buffer';

interface Payroll {
  id: string;
  month: string;
  year: number;
  employeeSalaries: EmployeeSalary[];
}

interface EmployeeSalary {
  id: string;
  name: string;
  baseSalary: number;
  deductions: number;
  variableSalary: number;
  netSalary: number;
  processed: boolean;
}

const PayrollList: React.FC = () => {
  const [employeeID, setEmployeeID] = useState<string>("");
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const fetchEmployeeIDAndPayrolls = async () => {
        try {
          const employeesQuery = query(
            collection(db, "Employees"),
            where("email", "==", currentUser.email)
          );
          const querySnapshot = await getDocs(employeesQuery);
          if (!querySnapshot.empty) {
            const employeeDoc = querySnapshot.docs[0];
            setEmployeeID(employeeDoc.id);

            // Fetch payrolls
            const payrollQuery = query(
              collection(db, "Payroll")
            );
            const payrollSnapshot = await getDocs(payrollQuery);
            const payrollsData: Payroll[] = payrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payroll));
            setPayrolls(payrollsData);
            console.log("Payrolls Data: ", payrollsData);
          }
        } catch (error) {
          console.error("Error fetching employee ID or payrolls: ", error);
        }
      };

      fetchEmployeeIDAndPayrolls();
    }
  }, []);

  const generatePDF = async (payroll: Payroll, salary: EmployeeSalary) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Payslip for ${salary.name}`, { x: 50, y: 350, size: 20 });
    page.drawText(`Month: ${payroll.month}`, { x: 50, y: 320, size: 16 });
    page.drawText(`Year: ${payroll.year}`, { x: 50, y: 300, size: 16 });
    page.drawText(`Base Salary: ${salary.baseSalary}`, { x: 50, y: 280, size: 16 });
    page.drawText(`Variable Salary: ${salary.variableSalary}`, { x: 50, y: 260, size: 16 });
    page.drawText(`Deductions: ${salary.deductions}`, { x: 50, y: 240, size: 16 });
    page.drawText(`Net Salary: ${salary.netSalary}`, { x: 50, y: 220, size: 16 });

    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const pdfPath = `${FileSystem.documentDirectory}payslip.pdf`;
    await FileSystem.writeAsStringAsync(pdfPath, base64Pdf, { encoding: FileSystem.EncodingType.Base64 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath);
    } else {
      Alert.alert("Error", "Sharing is not available on this device");
    }
  };

  const renderPayroll = ({ item }: { item: Payroll }) => {
    const employeeSalary = item.employeeSalaries.find(salary => salary.id === employeeID && salary.processed);
    if (!employeeSalary) return null;

    return (
      <View style={styles.payrollItem}>
        <Text style={styles.payrollText}>Month: {item.month}</Text>
        <Text style={styles.payrollText}>Year: {item.year}</Text>
        <Text style={styles.payrollText}>Net Salary: {employeeSalary.netSalary}</Text>
        <Pressable
          onPress={() => generatePDF(item, employeeSalary)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Download Payslip</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payrolls</Text>
      <FlatList
        data={payrolls}
        keyExtractor={(item) => item.id}
        renderItem={renderPayroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 120
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  payrollItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  payrollText: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PayrollList;
