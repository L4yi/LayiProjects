/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */

/**
 *
 * @author USER
 */
public class ageCalc extends javax.swing.JFrame {

    /**
     * Creates new form ageCalc
     */
    public ageCalc() {
        initComponents();
        getContentPane().setBackground(new java.awt.Color(153,153,153));
        birthyear2.setHorizontalAlignment(javax.swing.JTextField.CENTER);
    birthmonth2.setHorizontalAlignment(javax.swing.JTextField.CENTER);
    birthday2.setHorizontalAlignment(javax.swing.JTextField.CENTER);
    

    
    choice.removeAllItems();
    
    java.time.LocalDate today = java.time.LocalDate.now();
    java.time.format.DateTimeFormatter descriptiveFoormat =
                java.time.format.DateTimeFormatter.ofPattern("EEEE , dd MMMM yyyy");
    String formattedDateString = today.format(descriptiveFoormat);
    

    
    choice.addItem(formattedDateString);
    choice.setSelectedIndex(0);
    
    birthday2.setText("");
    birthmonth2.setText("");
    birthyear2.setText("");
    
    birthday2.setEditable(false);
    birthmonth2.setEditable(false);
    birthyear2.setEditable(false);
    }

    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel2 = new javax.swing.JPanel();
        calculate = new javax.swing.JButton();
        jLabel5 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        birthyear2 = new javax.swing.JTextField();
        birthmonth2 = new javax.swing.JTextField();
        birthday2 = new javax.swing.JTextField();
        clear = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        choice = new javax.swing.JComboBox<>();
        jLabel3 = new javax.swing.JLabel();
        monthOfBirth = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        yearOfBirth = new javax.swing.JTextField();
        jLabel10 = new javax.swing.JLabel();
        dayOfBirth = new javax.swing.JTextField();
        jLabel1 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setMinimumSize(new java.awt.Dimension(826, 613));

        jPanel2.setBackground(new java.awt.Color(153, 153, 153));
        jPanel2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(255, 255, 255)));
        jPanel2.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        calculate.setBackground(new java.awt.Color(102, 102, 102));
        calculate.setText("CALCULATE AGE");
        calculate.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                calculateActionPerformed(evt);
            }
        });
        jPanel2.add(calculate, new org.netbeans.lib.awtextra.AbsoluteConstraints(608, 203, 200, 60));
        jPanel2.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(814, 113, -1, -1));

        jPanel1.setBackground(new java.awt.Color(194, 189, 189));

        jLabel6.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(51, 51, 51));
        jLabel6.setText("YOUR BIRTHDAY IS :");

        jLabel7.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(0, 0, 0));
        jLabel7.setText("YEARS");

        jLabel8.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(0, 0, 0));
        jLabel8.setText("MONTHS");

        jLabel9.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(0, 0, 0));
        jLabel9.setText("DAYS");

        birthyear2.setBackground(new java.awt.Color(255, 255, 255));
        birthyear2.setBorder(null);

        birthmonth2.setBackground(new java.awt.Color(255, 255, 255));
        birthmonth2.setBorder(null);

        birthday2.setBackground(new java.awt.Color(255, 255, 255));
        birthday2.setBorder(null);
        birthday2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                birthday2ActionPerformed(evt);
            }
        });

        clear.setBackground(new java.awt.Color(153, 0, 0));
        clear.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        clear.setForeground(new java.awt.Color(255, 255, 255));
        clear.setText("CLEAR");
        clear.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                clearActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap(106, Short.MAX_VALUE)
                .addComponent(jLabel6)
                .addGap(14, 14, 14)
                .addComponent(birthyear2, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel7)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(birthmonth2, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(20, 20, 20)
                .addComponent(jLabel8)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(birthday2, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(8, 8, 8)
                .addComponent(jLabel9)
                .addGap(38, 38, 38)
                .addComponent(clear)
                .addGap(18, 18, 18))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(30, 30, 30)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel6)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8)
                    .addComponent(jLabel9)
                    .addComponent(birthyear2, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(birthmonth2, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(birthday2, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(clear, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(57, Short.MAX_VALUE))
        );

        jPanel2.add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 290, 810, -1));

        jLabel2.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(0, 0, 0));
        jLabel2.setText("TODAY'S DATE :");
        jPanel2.add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(16, 16, -1, -1));

        choice.setBackground(new java.awt.Color(255, 255, 255));
        choice.setForeground(new java.awt.Color(0, 0, 0));
        choice.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        choice.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                choiceActionPerformed(evt);
            }
        });
        jPanel2.add(choice, new org.netbeans.lib.awtextra.AbsoluteConstraints(137, 16, 302, -1));

        jLabel3.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(0, 0, 0));
        jLabel3.setText("ENTER BIRTHDAY");
        jPanel2.add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 90, -1, -1));

        monthOfBirth.setBackground(new java.awt.Color(255, 255, 255));
        jPanel2.add(monthOfBirth, new org.netbeans.lib.awtextra.AbsoluteConstraints(618, 121, 190, 38));

        jLabel4.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(0, 0, 0));
        jLabel4.setText("ENTER BIRTHYEAR");
        jPanel2.add(jLabel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 204, -1, -1));

        yearOfBirth.setBackground(new java.awt.Color(255, 255, 255));
        jPanel2.add(yearOfBirth, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 225, 190, 38));

        jLabel10.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(0, 0, 0));
        jLabel10.setText("ENTER BIRTHMONTH");
        jPanel2.add(jLabel10, new org.netbeans.lib.awtextra.AbsoluteConstraints(660, 100, -1, -1));

        dayOfBirth.setBackground(new java.awt.Color(255, 255, 255));
        dayOfBirth.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                dayOfBirthActionPerformed(evt);
            }
        });
        jPanel2.add(dayOfBirth, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 110, 190, 38));

        jLabel1.setFont(new java.awt.Font("Segoe UI", 1, 48)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 0, 0));
        jLabel1.setText("AGE CALCULATOR");
        jLabel1.setMinimumSize(new java.awt.Dimension(820, 544));
        jLabel1.setPreferredSize(new java.awt.Dimension(820, 544));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(56, 56, 56)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGap(231, 231, 231)
                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE)
                        .addGap(197, 197, 197))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(56, 56, 56))))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(21, 21, 21)
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 57, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(82, 82, 82)
                .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(35, 35, 35))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void birthday2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_birthday2ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_birthday2ActionPerformed

    private void calculateActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_calculateActionPerformed
try {
        // 1. Establish the current baseline date
        java.time.LocalDate today = java.time.LocalDate.now();
        int currentYear = today.getYear();

        // 2. Parse out user input strings into integers
        int birthDay = Integer.parseInt(dayOfBirth.getText().trim());
        int birthMonth = Integer.parseInt(monthOfBirth.getText().trim());
        int birthYear = Integer.parseInt(yearOfBirth.getText().trim());

        // 3. Validation pop-ups
        if (birthYear > currentYear || birthYear < 1) {
            javax.swing.JOptionPane.showMessageDialog(this, "Error: Please enter a valid birth year!", "Input Error", javax.swing.JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (birthMonth < 1 || birthMonth > 12) {
            javax.swing.JOptionPane.showMessageDialog(this, "Error: Month must be between 1 and 12!", "Input Error", javax.swing.JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (birthDay < 1 || birthDay > 31) {
            javax.swing.JOptionPane.showMessageDialog(this, "Error: Day must be between 1 and 31!", "Input Error", javax.swing.JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Create the core date profile validation checkpoint
        java.time.LocalDate birthDate = java.time.LocalDate.of(birthYear, birthMonth, birthDay);

        if (birthDate.isAfter(today)) {
            javax.swing.JOptionPane.showMessageDialog(this, "Error: Birth date cannot be in the future!", "Input Error", javax.swing.JOptionPane.ERROR_MESSAGE);
            return;
        }

        // 4. Calculate date differences using ChronoUnit formulas
        long calcYear = java.time.temporal.ChronoUnit.YEARS.between(birthDate, today);

        java.time.LocalDate sameDayThisYear = birthDate.plusYears(calcYear);
        long calcMonth = java.time.temporal.ChronoUnit.MONTHS.between(sameDayThisYear, today);

        java.time.LocalDate sameDayThisMonth = sameDayThisYear.plusMonths(calcMonth);
        long calcDay = java.time.temporal.ChronoUnit.DAYS.between(sameDayThisMonth, today);

        // 5. Set the output boxes to show the computed age results
        birthyear2.setText(String.valueOf(calcYear));
        birthmonth2.setText(String.valueOf(calcMonth));
        birthday2.setText(String.valueOf(calcDay));

    } catch (java.time.DateTimeException ex) {
        javax.swing.JOptionPane.showMessageDialog(this, "Error: Invalid date combination for that month!", "Date Error", javax.swing.JOptionPane.ERROR_MESSAGE);
    } catch (NumberFormatException e) {
        javax.swing.JOptionPane.showMessageDialog(this, "Error: Please fill all input text fields with numbers.", "Input Error", javax.swing.JOptionPane.ERROR_MESSAGE);
    }
    }//GEN-LAST:event_calculateActionPerformed

    private void choiceActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_choiceActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_choiceActionPerformed

    private void clearActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_clearActionPerformed
 birthyear2.setText("");
 birthmonth2.setText("");
 birthday2.setText("");
  yearOfBirth.setText("");
 monthOfBirth.setText("");
 dayOfBirth.setText("");

    }//GEN-LAST:event_clearActionPerformed

    private void dayOfBirthActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_dayOfBirthActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_dayOfBirthActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(ageCalc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(ageCalc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(ageCalc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(ageCalc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new ageCalc().setVisible(true);
            }
        });
    }
    
private void validateLiveInput(java.awt.event.KeyEvent evt, javax.swing.JTextField field) {
    char key = evt.getKeyChar();
    
    if (!Character.isDigit(key) && key != java.awt.event.KeyEvent.VK_BACK_SPACE && key != java.awt.event.KeyEvent.VK_DELETE) {
        evt.consume(); 
        
        javax.swing.JOptionPane.showMessageDialog(this, 
            "SECURITY ALERT: Only numbers are allowed in this field. Please correct your input!", 
            "Invalid Character", 
            javax.swing.JOptionPane.WARNING_MESSAGE);
    }
}

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JTextField birthday2;
    private javax.swing.JTextField birthmonth2;
    private javax.swing.JTextField birthyear2;
    private javax.swing.JButton calculate;
    private javax.swing.JComboBox<String> choice;
    private javax.swing.JButton clear;
    private javax.swing.JTextField dayOfBirth;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JTextField monthOfBirth;
    private javax.swing.JTextField yearOfBirth;
    // End of variables declaration//GEN-END:variables
}
