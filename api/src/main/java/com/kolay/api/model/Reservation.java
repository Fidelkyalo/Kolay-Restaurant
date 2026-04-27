package com.kolay.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String guestName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;

    @NotNull
    @JsonFormat(pattern = "HH:mm")
    private LocalTime reservationTime;

    @NotNull
    private Integer numberOfGuests;

    private String specialRequests;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;

    public enum ReservationStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }

    public Reservation() {
    }

    public Reservation(String guestName, String email, String phone, LocalDate reservationDate,
            LocalTime reservationTime, Integer numberOfGuests, String specialRequests) {
        this.guestName = guestName;
        this.email = email;
        this.phone = phone;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.numberOfGuests = numberOfGuests;
        this.specialRequests = specialRequests;
        this.status = ReservationStatus.PENDING;
    }

    // Builder pattern (manual replacement)
    public static ReservationBuilder builder() {
        return new ReservationBuilder();
    }

    public static class ReservationBuilder {
        private String guestName;
        private String email;
        private String phone;
        private LocalDate reservationDate;
        private LocalTime reservationTime;
        private Integer numberOfGuests;
        private String specialRequests;

        public ReservationBuilder guestName(String guestName) {
            this.guestName = guestName;
            return this;
        }

        public ReservationBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ReservationBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public ReservationBuilder reservationDate(LocalDate reservationDate) {
            this.reservationDate = reservationDate;
            return this;
        }

        public ReservationBuilder reservationTime(LocalTime reservationTime) {
            this.reservationTime = reservationTime;
            return this;
        }

        public ReservationBuilder numberOfGuests(Integer numberOfGuests) {
            this.numberOfGuests = numberOfGuests;
            return this;
        }

        public ReservationBuilder specialRequests(String specialRequests) {
            this.specialRequests = specialRequests;
            return this;
        }

        public Reservation build() {
            return new Reservation(guestName, email, phone, reservationDate, reservationTime, numberOfGuests,
                    specialRequests);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }

    public LocalTime getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(LocalTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
