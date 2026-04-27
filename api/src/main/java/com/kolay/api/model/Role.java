package com.kolay.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, unique = true)
    private RoleName name;

    public enum RoleName {
        ADMIN,
        MANAGER,
        CASHIER,
        WAITER,
        CHEF,
        STOREKEEPER,
        ACCOUNTANT,
        CUSTOMER
    }

    public Role() {
    }

    public Role(RoleName name) {
        this.name = name;
    }

    public static RoleBuilder builder() {
        return new RoleBuilder();
    }

    public static class RoleBuilder {
        private RoleName name;

        public RoleBuilder name(RoleName name) {
            this.name = name;
            return this;
        }

        public Role build() {
            return new Role(name);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name = name;
    }
}
