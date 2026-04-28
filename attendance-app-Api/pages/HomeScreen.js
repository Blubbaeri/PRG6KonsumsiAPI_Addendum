import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {

  const { userData } = useContext(AuthContext);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('Memuat jam...');
  const [note, setNote] = useState('');
  const noteInputRef = useRef(null);
  const [isPosting, setIsPosting] = useState(false);

  // ❗ GANTI IP INI
  const BASE_URL = "http://10.1.10.140:8080/api/presensi";

  const attendanceStats = useMemo(() => {
    return { totalPresent: 12, totalAbsent: 2 };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 CONNECT KE BACKEND
  const handleCheckIn = async () => {
    if (isCheckedIn) return Alert.alert("Perhatian", "Anda sudah Check In.");
    if (note.trim() === '') {
      Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
      noteInputRef.current?.focus();
      return;
    }

    setIsPosting(true);

    const now = new Date();

    const payload = {
      kodeMk: "TRPL205",
      course: "Mobile Programming",
      date: now.toISOString().split("T")[0],
      jamPresensi: now.toLocaleTimeString('id-ID', { hour12: false }),
      pertemuanKe: 5,
      status: "Present",
      nimMhs: userData.nimMhs, // ✅ FIXED
      ruangan: "Lab Komputer 3",
      dosenPengampu: "Tim Dosen TRPL"
    };

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsCheckedIn(true);
        Alert.alert("Berhasil", "Presensi berhasil dikirim ke server!");
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      Alert.alert("Error", "Pastikan backend berjalan & IP benar.");
      console.log(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        {/* USER CARD */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>{userData.nama}</Text>
            <Text style={styles.infoText}>NIM : {userData.nimMhs}</Text>
            <Text style={styles.infoText}>Class : Informatika-2B</Text>
          </View>
        </View>

        {/* CLASS */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text style={styles.classText}>Mobile Programming</Text>
          <Text style={styles.classDetail}>08:00 - 10:00</Text>
          <Text style={styles.classDetail}>Lab 3</Text>

          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef}
              style={styles.inputCatatan}
              placeholder="Tulis catatan (cth: Hadir lab)"
              value={note}
              onChangeText={setNote}
            />
          )}

          {isPosting ? (
            <ActivityIndicator size="large" style={{ marginTop: 15 }} />
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                isCheckedIn ? styles.buttonDisabled : styles.buttonActive
              ]}
              onPress={handleCheckIn}
              disabled={isCheckedIn}
            >
              <Text style={styles.buttonText}>
                {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: 'red' }]}>
              {attendanceStats.totalAbsent}
            </Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    content: {
        padding: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    clockText: {
        fontSize: 16,
        color: "#666",
        fontWeight: "600",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    infoText: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    classCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    classText: {
        fontSize: 16,
        color: "#444",
        marginBottom: 4,
    },
    classDetail: {
        fontSize: 14,
        color: "#777",
        marginBottom: 2,
    },
    inputCatatan: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        padding: 12,
        marginTop: 15,
        backgroundColor: "#FAFAFA",
    },
    button: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonActive: {
        backgroundColor: "#1565C0",
    },
    buttonDisabled: {
        backgroundColor: "#A0A0A0",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    statsCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
    },
    statBox: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    statLabel: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
    },
});