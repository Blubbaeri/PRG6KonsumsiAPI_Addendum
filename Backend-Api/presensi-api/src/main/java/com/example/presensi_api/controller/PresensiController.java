package com.example.presensi_api.controller;

import com.example.presensi_api.entity.Presensi;
import com.example.presensi_api.repository.PresensiRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/presensi")
@CrossOrigin(origins = "*")
public class PresensiController {

    private final PresensiRepository repo;

    public PresensiController(PresensiRepository repo) {
        this.repo = repo;
    }

    // ✅ POST (tambah presensi)
    @PostMapping
    public Presensi create(@RequestBody Presensi data) {
        return repo.save(data);
    }

    // ✅ GET HISTORY + PAGINATION
    @GetMapping("/history/{nim}")
    public Page<Presensi> getHistory(
            @PathVariable String nim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNimMhs(nim, pageable);
    }

    // ✅ PUT (update status/jam)
    @PutMapping("/{id}")
    public ResponseEntity<Presensi> update(@PathVariable Long id, @RequestBody Presensi data) {
        return repo.findById(id)
                .map(p -> {
                    p.setStatus(data.getStatus());
                    p.setJamPresensi(data.getJamPresensi());
                    return ResponseEntity.ok(repo.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
