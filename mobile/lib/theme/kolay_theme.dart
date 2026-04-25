import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KolayTheme {
  static const Color primary = Color(0xFF4E2C1E);
  static const Color secondary = Color(0xFFE67E22);
  static const Color accent = Color(0xFFD4A017);
  static const Color background = Color(0xFFFFF8F0);
  static const Color charcoal = Color(0xFF2C2C2C);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      primary: primary,
      secondary: secondary,
      tertiary: accent,
      background: background,
      surface: Colors.white,
    ),
    textTheme: GoogleFonts.outfitTextTheme().copyWith(
      displayLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: primary),
      displayMedium: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: primary),
      titleLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: primary),
      bodyLarge: GoogleFonts.inter(color: charcoal),
      bodyMedium: GoogleFonts.inter(color: charcoal.withOpacity(0.8)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: secondary,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        elevation: 10,
        shadowColor: secondary.withOpacity(0.4),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: Color(0xFFF3E5D8)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: Color(0xFFF3E5D8)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: secondary, width: 2),
      ),
    ),
  );
}
