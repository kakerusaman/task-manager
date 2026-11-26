package com.example.task.model;

import java.time.LocalDate;

public record Task (
    int id,
    String title,
    LocalDate date,
    String time,
    boolean done,
    double hours,
    Report report
) {}
    

