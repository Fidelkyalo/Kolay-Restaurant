import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:kolay_mobile/theme/kolay_theme.dart';

class POSScreen extends StatefulWidget {
  const POSScreen({super.key});

  @override
  State<POSScreen> createState() => _POSScreenState();
}

class _POSScreenState extends State<POSScreen> {
  String activeCategory = 'All';
  final List<String> categories = ['All', 'Main', 'Sides', 'Drinks', 'Dessert'];
  
  // Mock Cart
  int itemCount = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text('KOLAY POS', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(LucideIcons.search),
          ),
        ],
      ),
      body: Column(
        children: [
          // Table & Waiter Info
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: KolayTheme.primary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text('Table: T-05', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
                const Spacer(),
                const CircleAvatar(
                  radius: 18,
                  backgroundColor: KolayTheme.background,
                  child: Icon(LucideIcons.user, size: 18, color: KolayTheme.primary),
                ),
              ],
            ),
          ),
          
          // Categories
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final cat = categories[index];
                final isSelected = activeCategory == cat;
                return GestureDetector(
                  onTap: () => setState(() => activeCategory = cat),
                  child: Container(
                    margin: const EdgeInsets.only(right: 12, top: 10, bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    decoration: BoxDecoration(
                      color: isSelected ? KolayTheme.secondary : KolayTheme.background,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: isSelected ? [
                        BoxShadow(color: KolayTheme.secondary.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))
                      ] : null,
                    ),
                    child: Center(
                      child: Text(
                        cat,
                        style: TextStyle(
                          color: isSelected ? Colors.white : KolayTheme.charcoal.withOpacity(0.6),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Menu Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(20),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.8,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
              ),
              itemCount: 6,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () => setState(() => itemCount++),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: KolayTheme.background),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: KolayTheme.background,
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                            ),
                            child: const Center(child: Icon(LucideIcons.utensils, size: 40, color: KolayTheme.primary)),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Beef Burger', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              const SizedBox(height: 4),
                              const Text('KES 850', style: TextStyle(color: KolayTheme.secondary, fontWeight: FontWeight.w900)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5))
          ],
        ),
        child: ElevatedButton(
          onPressed: itemCount > 0 ? () {} : null,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.shoppingCart),
              const SizedBox(width: 12),
              Text('REVIEW ORDER ($itemCount ITEMS)'),
            ],
          ),
        ),
      ),
    );
  }
}
