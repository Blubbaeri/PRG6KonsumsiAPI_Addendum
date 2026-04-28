package com.example.presensi_api;

import com.example.presensi_api.entity.Presensi;
import com.example.presensi_api.repository.PresensiRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final PresensiRepository repository;

    public DatabaseSeeder(PresensiRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            List<Presensi> dummyDataList = new ArrayList<>();
            Random random = new Random();
            String nimMhs = "0325260031";

            for (int i = 1; i <= 200; i++) {
                Presensi p = new Presensi();
                p.setKodeMk("PRG6");
                p.setCourse("Pemrograman Perangkat Bergerak");
                p.setNimMhs(nimMhs);
                p.setPertemuanKe((i % 14) + 1);
                p.setRuangan("Lab 0" + (random.nextInt(5) + 1));
                p.setDosenPengampu("Dosen Pengampu " + ((i % 3) + 1));
                p.setStatus(random.nextBoolean() ? "Hadir" : "Izin");
                
                // Format jam HH:mm:ss
                String hour = String.format("%02d", random.nextInt(24));
                String minute = String.format("%02d", random.nextInt(60));
                String second = String.format("%02d", random.nextInt(60));
                p.setJamPresensi(hour + ":" + minute + ":" + second);
                
                // Optional date field
                p.setDate("2024-04-" + String.format("%02d", (random.nextInt(30) + 1)));

                dummyDataList.add(p);
            }

            repository.saveAll(dummyDataList);
            System.out.println("✅ Berhasil menyimpan 200 data dummy ke database!");
        }
    }
}
