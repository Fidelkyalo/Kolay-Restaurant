import 'package:flutter/material.dart';
import 'package:kolay_mobile/screens/login_screen.dart';
import 'package:kolay_mobile/theme/kolay_theme.dart';

void main() {
  runApp(const KolayApp());
}

class KolayApp extends StatelessWidget {
  const KolayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kolay Restaurant',
      debugShowCheckedModeBanner: false,
      theme: KolayTheme.lightTheme,
      home: const LoginScreen(),
    );
  }
}
