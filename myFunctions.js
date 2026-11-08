$(document).ready(function () {
  $(".toggle-details").click(function () {
    var targetRowId = $(this).attr("value");
    if ($(this).is(":checked")) {
      $("#" + targetRowId).slideDown(350);
    } else {
      $("#" + targetRowId).slideUp(250);
    }
  });
});

function proceedToBooking() {
  var carCheckboxes = document.getElementsByName("selectedCars");
  var countSelected = 0;

  for (var i = 0; i < carCheckboxes.length; i++) {
    if (carCheckboxes[i].checked) {
      countSelected++;
    }
  }

  if (countSelected == 0) {
    alert("تنبيه: يرجى اختيار سيارة واحدة على الأقل من عمود (اختيار) قبل المتابعة إلى الحجز.");
    return false;
  }

  $("#bookingSection").slideDown(600, function () {
    $("html, body").animate({ scrollTop: $("#bookingSection").offset().top - 80 }, 500);
    // التركيز على أول حقل إلزامي
    $("#nationalId").focus();
  });

  return true;
}

function chkFullName() {
  var nameInput = document.getElementById("fullName");
  var val = nameInput.value.replace(/^\s+|\s+$/g, "");
  nameInput.value = val;

  if (val == "") return true;

  if (val.search(/^[\u0621-\u064A\s]+$/) != 0) {
    alert(
      "خطأ في إدخال الاسم:\n" +
        "الاسم الكامل يجب أن يتكون من أحرف هجائية عربية فقط دون أرقام أو رموز.",
    );
    nameInput.focus();
    nameInput.select();
    return false;
  }
  return true;
}

function chkNationalId() {
  var nidInput = document.getElementById("nationalId");
  var val = nidInput.value.replace(/^\s+|\s+$/g, "");
  nidInput.value = val;

  if (val == "") {
    alert("حقل إلزامي:\nيرجى إدخال الرقم الوطني المكون من 11 خانة.");
    nidInput.focus();
    return false;
  }

  if (val.search(/^(0[1-9]|1[0-4])\d{9}$/) != 0) {
    alert(
      "خطأ في الرقم الوطني (" +
        val +
        "):\n" +
        "يجب أن يتكون من 11 خانة رقمية بالضبط، وأن ترمز أول خانتين إلى المحافظة (من 01 إلى 14).",
    );
    nidInput.focus();
    nidInput.select();
    return false;
  }
  return true;
}

function chkRentalDates() {
  var startInput = document.getElementById("startDate");
  var endInput = document.getElementById("endDate");
  var startVal = startInput.value;
  var endVal = endInput.value;

  if (startVal == "") {
    alert("حقل إلزامي:\nيرجى تحديد تاريخ بداية التأجير.");
    startInput.focus();
    return false;
  }

  if (startVal.search(/^\d{4}-\d{2}-\d{2}$/) != 0) {
    alert("خطأ في الصيغة:\nتاريخ بداية التأجير يجب أن يكون بالصيغة yyyy-mm-dd.");
    startInput.focus();
    return false;
  }

  if (endVal == "") {
    alert("حقل إلزامي:\nيرجى تحديد تاريخ نهاية التأجير.");
    endInput.focus();
    return false;
  }

  if (endVal.search(/^\d{4}-\d{2}-\d{2}$/) != 0) {
    alert("خطأ في الصيغة:\nتاريخ نهاية التأجير يجب أن يكون بالصيغة yyyy-mm-dd.");
    endInput.focus();
    return false;
  }

  var sDate = new Date(startVal);
  var eDate = new Date(endVal);

  if (eDate.getTime() <= sDate.getTime()) {
    alert(
      "خطأ في التسلسل الزمني:\n" +
        "تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ بداية التأجير (يوم واحد على الأقل).",
    );
    endInput.focus();
    return false;
  }

  return true;
}

function chkMobile() {
  var mobInput = document.getElementById("mobileNum");
  var val = mobInput.value.replace(/^\s+|\s+$/g, "");
  mobInput.value = val;

  if (val == "") return true;

  if (val.search(/^09[345689]\d{7}$/) != 0) {
    alert(
      "خطأ في رقم الموبايل (" +
        val +
        "):\n" +
        "يرجى إدخال رقم موبايل سوري صحيح مكون من 10 أرقام يطابق:\n" +
        "• Syriatel: 093, 098, 099\n" +
        "• MTN: 094, 095, 096",
    );
    mobInput.focus();
    mobInput.select();
    return false;
  }
  return true;
}

function chkEmail() {
  var emailInput = document.getElementById("emailAddr");
  var val = emailInput.value.replace(/^\s+|\s+$/g, "");
  emailInput.value = val;

  if (val == "") return true;

  if (val.search(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/) != 0 || val.length < 6) {
    alert(
      "خطأ في البريد الإلكتروني (" +
        val +
        "):\n" +
        "يرجى إدخال بريد إلكتروني بصيغة صحيحة (مثال: name@domain.com).",
    );
    emailInput.focus();
    emailInput.select();
    return false;
  }
  return true;
}

function processBookingForm() {
  var carCheckboxes = document.getElementsByName("selectedCars");
  var selectedList = new Array();

  for (var i = 0; i < carCheckboxes.length; i++) {
    if (carCheckboxes[i].checked) {
      selectedList[selectedList.length] = carCheckboxes[i].value;
    }
  }

  if (selectedList.length == 0) {
    alert("تنبيه: لم يتم تحديد أي سيارة! يرجى اختيار سيارة واحدة على الأقل من الجدول.");
    return false;
  }

  if (!chkNationalId()) return false;
  if (!chkRentalDates()) return false;
  if (!chkFullName()) return false;
  if (!chkMobile()) return false;
  if (!chkEmail()) return false;

  var sDate = new Date(document.getElementById("startDate").value);
  var eDate = new Date(document.getElementById("endDate").value);
  var diffTime = eDate.getTime() - sDate.getTime();
  var rentalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  var applicantName = document.getElementById("fullName").value;
  var nationalIdVal = document.getElementById("nationalId").value;
  var mobileVal = document.getElementById("mobileNum").value;
  var emailVal = document.getElementById("emailAddr").value;
  var startDateVal = document.getElementById("startDate").value;
  var endDateVal = document.getElementById("endDate").value;

  var totalBeforeDiscount = 0;
  var alertCarsDetails = "";
  var htmlCarsDetails = "";

  for (var j = 0; j < selectedList.length; j++) {
    var parts = selectedList[j].split("|");
    var carCode = parts[0];
    var carModel = parts[1];
    var dailyPrice = parseInt(parts[2]);

    var carSubTotal = dailyPrice * rentalDays;
    totalBeforeDiscount = totalBeforeDiscount + carSubTotal;

    alertCarsDetails +=
      j +
      1 +
      "- " +
      carModel +
      " (" +
      carCode +
      ") | " +
      "أيام: " +
      rentalDays +
      " | الكلفة: " +
      carSubTotal +
      " ل.س\n";

    htmlCarsDetails +=
      '<div class="invoice-car-item">' +
      '<span class="invoice-car-name">' +
      carModel +
      " (" +
      carCode +
      ")</span>" +
      '<span class="invoice-car-detail">' +
      rentalDays +
      " يوم × " +
      dailyPrice.toLocaleString() +
      " ل.س</span>" +
      '<span class="invoice-car-price">' +
      carSubTotal.toLocaleString() +
      " ل.س</span>" +
      "</div>";
  }

  var discountAmount = 0;
  var discountNote = "لا يوجد خصم (مدة التأجير 7 أيام أو أقل)";
  var hasDiscount = false;

  if (rentalDays > 7) {
    discountAmount = Math.round(totalBeforeDiscount * 0.1);
    discountNote = discountAmount.toLocaleString() + " ل.س (خصم 10% لتجاوز مدة التأجير 7 أيام)";
    hasDiscount = true;
  }

  var finalTotalAmount = totalBeforeDiscount - discountAmount;

  var contactText = "";
  if (mobileVal != "" && emailVal != "") {
    contactText = mobileVal + " / " + emailVal;
  } else if (mobileVal != "") {
    contactText = mobileVal + " (موبايل)";
  } else if (emailVal != "") {
    contactText = emailVal + " (إيميل)";
  } else {
    contactText = "غير محدد";
  }

  var alertMessage = "تم التحقق من البيانات وتأكيد طلب الحجز بنجاح!\n";
  alertMessage += "========================================\n";

  if (applicantName != "") {
    alertMessage += "مقدم الطلب: " + applicantName + "\n";
  }

  alertMessage += "الرقم الوطني: " + nationalIdVal + "\n";
  alertMessage += "التواصل: " + contactText + "\n";
  alertMessage += "فترة التأجير: من " + startDateVal + " إلى " + endDateVal + "\n";
  alertMessage += "========================================\n";
  alertMessage += "السيارات المختارة:\n" + alertCarsDetails;
  alertMessage += "========================================\n";
  alertMessage += "المجموع قبل الخصم: " + totalBeforeDiscount + " ل.س\n";
  alertMessage += "قيمة الخصم: " + discountNote + "\n";
  alertMessage += "المبلغ الإجمالي النهائي: " + finalTotalAmount + " ل.س";

  alert(alertMessage);

  var invoiceHtml = '<div class="invoice-section">';

  invoiceHtml +=
    '<div class="invoice-success">' +
    '<span class="invoice-check">✓</span>' +
    "<span>تم التحقق من البيانات بنجاح - طلب الحجز مؤكد</span>" +
    "</div>";

  invoiceHtml += '<div class="invoice-info-grid">';

  if (applicantName != "") {
    invoiceHtml +=
      '<div class="invoice-row">' +
      '<span class="invoice-label">الاسم الكامل:</span>' +
      '<span class="invoice-value">' +
      applicantName +
      "</span></div>";
  }

  invoiceHtml +=
    '<div class="invoice-row">' +
    '<span class="invoice-label">الرقم الوطني:</span>' +
    '<span class="invoice-value">' +
    nationalIdVal +
    "</span></div>";

  invoiceHtml +=
    '<div class="invoice-row">' +
    '<span class="invoice-label">التواصل:</span>' +
    '<span class="invoice-value">' +
    contactText +
    "</span></div>";

  invoiceHtml +=
    '<div class="invoice-row">' +
    '<span class="invoice-label">عدد الأيام:</span>' +
    '<span class="invoice-value invoice-highlight">' +
    rentalDays +
    " يوم</span></div>";

  invoiceHtml +=
    '<div class="invoice-row">' +
    '<span class="invoice-label">من:</span>' +
    '<span class="invoice-value">' +
    startDateVal +
    "</span></div>";

  invoiceHtml +=
    '<div class="invoice-row">' +
    '<span class="invoice-label">إلى:</span>' +
    '<span class="invoice-value">' +
    endDateVal +
    "</span></div>";

  invoiceHtml += "</div>";

  invoiceHtml += '<h4 class="invoice-subtitle">السيارات المحجوزة:</h4>';
  invoiceHtml += htmlCarsDetails;

  invoiceHtml += '<div class="invoice-totals">';
  invoiceHtml +=
    '<div class="invoice-total-row">' +
    "<span>المجموع قبل الخصم:</span>" +
    "<span>" +
    totalBeforeDiscount.toLocaleString() +
    " ل.س</span></div>";

  if (hasDiscount) {
    invoiceHtml +=
      '<div class="invoice-total-row discount">' +
      "<span>الخصم (10%):</span>" +
      "<span>- " +
      discountAmount.toLocaleString() +
      " ل.س</span></div>";
  } else {
    invoiceHtml +=
      '<div class="invoice-total-row">' + "<span>الخصم:</span>" + "<span>لا يوجد</span></div>";
  }

  invoiceHtml +=
    '<div class="invoice-final-total">' +
    "<span>المبلغ النهائي:</span>" +
    "<span>" +
    finalTotalAmount.toLocaleString() +
    " ل.س</span></div>";

  invoiceHtml += "</div>";
  invoiceHtml += "</div>";

  $("#invoiceContent").html(invoiceHtml);
  $("#resultInvoice").fadeIn(700, function () {
    $("html, body").animate({ scrollTop: $("#resultInvoice").offset().top - 80 }, 600);
  });

  return false;
}
