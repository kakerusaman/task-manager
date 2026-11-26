package com.example.task.model;

import java.time.LocalDate;

public record TaskRow(
    Integer id,
    String title,
    LocalDate date,
    String time,
    boolean done,
    Double hours,
    String summary,
    String explanation,
    String example
) {}