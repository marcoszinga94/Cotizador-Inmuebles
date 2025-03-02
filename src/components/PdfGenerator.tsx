"use client";

import { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
  Path,
  G,
  Rect,
} from "@react-pdf/renderer";

interface PdfGeneratorProps {
  propiedad: string;
  terreno: string;
  valorResidual: number;
  valorReposicion: number;
  anosPropiedad: number;
  estadoPropiedad: number;
  cantidadM2: number;
  valorM2: number;
  dolarHoy: number;
  valorActual: number;
  valorTerreno: number;
  valorTotal: number;
  valorTotalDolares: number;
  coeficienteK: number;
}

// Definir estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    marginBottom: 2,
  },
  logoSubtext: {
    fontSize: 8,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
  },
  formula: {
    fontSize: 11,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  listItem: {
    fontSize: 11,
    marginLeft: 15,
    marginBottom: 3,
    flexDirection: "row",
  },
  bullet: {
    width: 10,
    fontSize: 11,
  },
  listItemContent: {
    flex: 1,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontFamily: "Helvetica-Bold",
  },
  tableTotal: {
    backgroundColor: "#f9f9f9",
    fontFamily: "Helvetica-Bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCellConcept: {
    width: "50%",
  },
  tableCellValue: {
    width: "25%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
  },
  underline: {
    textDecoration: "underline",
  },
  propertyLine: {
    flexDirection: "row",
    marginBottom: 5,
  },
  propertyLabel: {
    fontSize: 11,
  },
  propertyValue: {
    fontSize: 11,
    flex: 1,
    borderBottom: "1 solid black",
    marginLeft: 5,
    marginRight: 5,
  },
  propertyLocation: {
    fontSize: 11,
  },
  stateTable: {
    marginTop: 5,
    marginBottom: 10,
  },
  stateRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  stateCell: {
    fontSize: 10,
    marginRight: 5,
  },
  stateCellBold: {
    fontSize: 10,
    marginRight: 5,
    fontFamily: "Helvetica-Bold",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

// Componente del documento PDF
const TasacionPDF = ({
  propiedad,
  terreno,
  valorResidual,
  valorReposicion,
  anosPropiedad,
  estadoPropiedad,
  cantidadM2,
  valorM2,
  dolarHoy,
  valorActual,
  valorTerreno,
  valorTotal,
  valorTotalDolares,
  coeficienteK,
}: PdfGeneratorProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoText = (estado: number) => {
    const estados = [
      "Excelente",
      "Muy bueno",
      "Bueno",
      "Normal",
      "Regular",
      "Malo",
      "Muy malo",
      "Demolición",
      "Irrecuperable",
    ];
    return estados[estado - 1] || "Desconocido";
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Svg width="433" viewBox="0 0 324.75 170.25" height="227">
              <clipPath id="prefix__a">
                <Path d="M29.898 0h264.336v76.91H29.898zm0 0" />
              </clipPath>
              <clipPath id="prefix__b">
                <Path d="M95 54h23v22.91H95zm0 0" />
              </clipPath>
              <Path
                fill="#000"
                d="M53.433 102.933c2.301 1.074 4.094 2.476 5.375 4.203 1.29 1.718 1.938 3.71 1.938 5.968 0 4.438-1.461 7.7-4.375 9.782-2.906 2.074-6.543 3.109-10.906 3.109H30.902v-43.75h12.844c4.633 0 8.281.945 10.937 2.828 2.657 1.887 3.985 4.61 3.985 8.172 0 2.18-.461 4.09-1.375 5.734-.907 1.649-2.196 2.965-3.86 3.954zm-13.906-2.797h5.234c1.582 0 2.805-.485 3.672-1.453.875-.97 1.313-2.165 1.313-3.594 0-1.469-.496-2.586-1.485-3.36-.992-.77-2.355-1.156-4.093-1.156h-4.64zm5.531 17.828c2.02 0 3.649-.406 4.89-1.219 1.25-.812 1.876-2.023 1.876-3.64 0-3.094-2.453-4.641-7.36-4.641h-4.937v9.5zm0 0M72.635 104.183c0-3.957 1-7.66 3-11.11 2-3.445 4.71-6.191 8.14-8.234 3.426-2.04 7.145-3.063 11.157-3.063 4 0 7.71 1.024 11.14 3.063 3.426 2.043 6.16 4.789 8.203 8.234 2.04 3.45 3.063 7.153 3.063 11.11 0 4.043-1.024 7.765-3.063 11.171a22.858 22.858 0 01-8.203 8.11c-3.43 2-7.14 3-11.14 3-4.043 0-7.774-1-11.188-3-3.406-2-6.11-4.703-8.11-8.11-2-3.406-3-7.128-3-11.171zm8.922 0c0 2.53.601 4.87 1.812 7.015 1.207 2.137 2.848 3.828 4.922 5.078 2.082 1.25 4.394 1.875 6.937 1.875 2.457 0 4.696-.625 6.72-1.875 2.019-1.25 3.602-2.93 4.75-5.047 1.144-2.125 1.718-4.472 1.718-7.046 0-2.614-.594-4.989-1.781-7.125-1.188-2.145-2.805-3.844-4.844-5.094-2.043-1.25-4.309-1.875-6.797-1.875-2.5 0-4.773.625-6.812 1.875-2.043 1.25-3.657 2.949-4.844 5.094-1.188 2.136-1.781 4.511-1.781 7.125zm0 0M158.412 82.245v8.328h-10.64v35.422h-8.625V90.573h-10.22v-8.328zm0 0M199.19 82.245v8.328h-10.64v35.422h-8.625V90.573h-10.219v-8.328zm0 0M210.782 104.183c0-3.957 1-7.66 3-11.11 2-3.445 4.71-6.191 8.14-8.234 3.426-2.04 7.145-3.063 11.157-3.063 4 0 7.71 1.024 11.14 3.063 3.426 2.043 6.16 4.789 8.203 8.234 2.04 3.45 3.063 7.153 3.063 11.11 0 4.043-1.023 7.765-3.063 11.171a22.858 22.858 0 01-8.203 8.11c-3.43 2-7.14 3-11.14 3-4.043 0-7.774-1-11.188-3-3.406-2-6.11-4.703-8.11-8.11-2-3.406-3-7.128-3-11.171zm8.922 0c0 2.53.601 4.87 1.812 7.015 1.207 2.137 2.848 3.828 4.922 5.078 2.082 1.25 4.395 1.875 6.938 1.875 2.457 0 4.695-.625 6.718-1.875 2.02-1.25 3.602-2.93 4.75-5.047 1.145-2.125 1.72-4.472 1.72-7.046 0-2.614-.595-4.989-1.782-7.125-1.188-2.145-2.805-3.844-4.844-5.094-2.043-1.25-4.308-1.875-6.797-1.875-2.5 0-4.773.625-6.812 1.875-2.043 1.25-3.657 2.949-4.844 5.094-1.188 2.136-1.781 4.511-1.781 7.125zm0 0M293.403 92.823c-3.804-2.094-7.11-3.14-9.922-3.14-1.906 0-3.386.375-4.437 1.125-1.043.75-1.563 1.882-1.563 3.39 0 1.387.758 2.606 2.282 3.656 1.53 1.055 3.562 2.055 6.093 3 2.063.75 3.828 1.618 5.297 2.594 1.469.969 2.688 2.309 3.656 4.016.97 1.699 1.454 3.855 1.454 6.469 0 2.261-.586 4.355-1.75 6.28-1.168 1.919-2.883 3.438-5.141 4.563-2.262 1.125-4.961 1.688-8.094 1.688a27 27 0 01-7.781-1.156 24.199 24.199 0 01-7.188-3.532l3.797-6.718c1.508 1.117 3.235 2.03 5.172 2.75 1.946.71 3.692 1.062 5.235 1.062 1.82 0 3.406-.383 4.75-1.156 1.351-.781 2.03-2.04 2.03-3.781 0-2.258-2.12-4.223-6.359-5.891-2.5-.988-4.585-1.938-6.25-2.844-1.667-.914-3.105-2.222-4.312-3.922-1.211-1.707-1.813-3.847-1.813-6.422 0-3.77 1.239-6.8 3.72-9.093 2.476-2.301 5.773-3.551 9.89-3.75 3.25 0 5.96.37 8.14 1.109 2.188.73 4.313 1.766 6.375 3.11zm0 0M29.04 141.742c1.594 0 3.032.422 4.313 1.266l-.86 1.843c-1.261-.77-2.468-1.156-3.624-1.156-.617 0-1.106.117-1.469.344-.355.219-.531.539-.531.953 0 .406.16.758.484 1.047.332.293.742.508 1.234.64.5.137 1.036.31 1.61.516.57.2 1.101.414 1.594.64.5.231.91.59 1.234 1.079.32.492.484 1.078.484 1.765 0 1.086-.433 1.954-1.297 2.61-.867.648-1.984.969-3.359.969a7.264 7.264 0 01-2.734-.532 7.618 7.618 0 01-2.313-1.437l.906-1.797a7.056 7.056 0 002.047 1.328c.75.313 1.461.469 2.141.469.727 0 1.29-.129 1.687-.39.407-.27.61-.641.61-1.11 0-.414-.168-.77-.5-1.063-.324-.289-.735-.504-1.235-.64a31.193 31.193 0 01-1.593-.485 20.39 20.39 0 01-1.61-.625 2.936 2.936 0 01-1.234-1.047c-.324-.476-.484-1.062-.484-1.75 0-1.039.41-1.875 1.234-2.5.82-.625 1.91-.937 3.266-.937zm0 0M46.518 143.695h-6.735v3.344h6.032v1.86h-6.032v3.405h6.953v1.875h-9.03v-12.343h8.812zm0 0M58.86 154.18l-2.25-3.735a6.762 6.762 0 01-.563.016H53.11v3.718H51.03v-12.343h5.016c1.57 0 2.79.37 3.656 1.11.875.73 1.313 1.765 1.313 3.108 0 .981-.227 1.813-.672 2.5-.438.68-1.07 1.18-1.89 1.5l2.765 4.125zm-5.75-5.594h2.937c1.988 0 2.984-.828 2.984-2.485 0-1.601-.996-2.406-2.984-2.406H53.11zm0 0M71.038 154.18h-2.156l-4.922-12.344h2.25l3.813 10.031 3.844-10.031h2.171zm0 0M81.542 154.18h-2.078v-12.344h2.078zm0 0M92.02 141.773c.864 0 1.711.172 2.547.516a6.34 6.34 0 012.14 1.39l-1.218 1.516c-.45-.476-.98-.86-1.594-1.14a4.332 4.332 0 00-1.843-.422c-1.23 0-2.274.421-3.125 1.265-.856.836-1.282 1.86-1.282 3.078 0 1.22.426 2.25 1.282 3.094.851.836 1.894 1.25 3.125 1.25 1.28 0 2.425-.484 3.437-1.453l1.234 1.375a7.203 7.203 0 01-2.218 1.484c-.844.368-1.7.547-2.563.547-1.812 0-3.34-.601-4.578-1.812-1.23-1.207-1.844-2.696-1.844-4.469 0-1.75.625-3.223 1.875-4.422 1.258-1.195 2.801-1.797 4.625-1.797zm0 0M102.678 154.18H100.6v-12.344h2.078zm0 0M108.547 143.57c1.258-1.195 2.813-1.797 4.657-1.797 1.843 0 3.394.602 4.656 1.797 1.258 1.2 1.89 2.68 1.89 4.438 0 1.761-.632 3.246-1.89 4.453-1.262 1.21-2.813 1.812-4.656 1.812-1.844 0-3.399-.601-4.657-1.812-1.261-1.207-1.89-2.692-1.89-4.453 0-1.758.629-3.239 1.89-4.438zm4.672.078c-1.218 0-2.265.422-3.14 1.266-.868.836-1.297 1.867-1.297 3.094 0 1.218.437 2.257 1.312 3.109.875.855 1.914 1.281 3.125 1.281 1.219 0 2.254-.426 3.11-1.281.851-.852 1.28-1.89 1.28-3.11 0-1.226-.429-2.257-1.28-3.093-.856-.844-1.891-1.266-3.11-1.266zm0 0M127.79 141.742c1.594 0 3.032.422 4.313 1.266l-.86 1.843c-1.26-.77-2.468-1.156-3.624-1.156-.617 0-1.106.117-1.469.344-.355.219-.531.539-.531.953 0 .406.16.758.484 1.047.332.293.742.508 1.235.64.5.137 1.035.31 1.61.516.57.2 1.102.414 1.594.64.5.231.91.59 1.234 1.079.32.492.484 1.078.484 1.765 0 1.086-.433 1.954-1.296 2.61-.868.648-1.985.969-3.36.969a7.264 7.264 0 01-2.734-.532 7.618 7.618 0 01-2.313-1.437l.907-1.797a7.056 7.056 0 002.046 1.328c.75.313 1.461.469 2.141.469.727 0 1.29-.129 1.688-.39.406-.27.609-.641.609-1.11 0-.414-.168-.77-.5-1.063-.324-.289-.734-.504-1.234-.64a31.193 31.193 0 01-1.594-.485 20.39 20.39 0 01-1.61-.625 2.936 2.936 0 01-1.234-1.047c-.324-.476-.484-1.062-.484-1.75 0-1.039.41-1.875 1.234-2.5.82-.625 1.91-.937 3.266-.937zm0 0M144.846 154.18h-2.078v-12.344h2.078zm0 0M160.558 154.18h-2.047l-6.578-8.86v8.86h-2.078v-12.344h2.047l6.61 8.875v-8.875h2.046zm0 0M178.625 154.18h-1.922l-.015-9.22-3.891 7.938h-1.36l-3.906-7.937v9.218h-1.953v-12.343h2.469l4.078 8.203 4.047-8.203h2.453zm0 0M184.504 143.57c1.258-1.195 2.813-1.797 4.657-1.797 1.843 0 3.394.602 4.656 1.797 1.258 1.2 1.89 2.68 1.89 4.438 0 1.761-.632 3.246-1.89 4.453-1.262 1.21-2.813 1.812-4.656 1.812-1.844 0-3.399-.601-4.657-1.812-1.261-1.207-1.89-2.692-1.89-4.453 0-1.758.629-3.239 1.89-4.438zm4.672.078c-1.218 0-2.265.422-3.14 1.266-.868.836-1.297 1.867-1.297 3.094 0 1.218.437 2.257 1.312 3.109.875.855 1.914 1.281 3.125 1.281 1.219 0 2.254-.426 3.11-1.281.851-.852 1.28-1.89 1.28-3.11 0-1.226-.429-2.257-1.28-3.093-.856-.844-1.891-1.266-3.11-1.266zm0 0M199.685 141.836h5.36c1.28 0 2.289.277 3.03.828.74.543 1.11 1.293 1.11 2.25 0 .7-.195 1.293-.578 1.781-.387.492-.914.813-1.578.969.82.148 1.469.496 1.937 1.047.47.554.704 1.246.704 2.078 0 1.062-.403 1.898-1.204 2.5-.804.594-1.902.89-3.296.89h-5.485zm2.078 1.843v3.266h3.172c.664 0 1.188-.144 1.563-.437.375-.29.562-.696.562-1.22 0-.519-.187-.913-.562-1.187-.367-.28-.887-.422-1.563-.422zm0 5.11v3.531h3.172c.82 0 1.457-.148 1.906-.453.458-.313.688-.758.688-1.344 0-.539-.23-.96-.688-1.265-.46-.313-1.093-.47-1.906-.47zm0 0M215.97 154.18h-2.077v-12.344h2.078zm0 0M223.058 152.289h5.344v1.89h-7.422v-12.343h2.078zm0 0M234.235 154.18h-2.078v-12.344h2.078zm0 0M247.213 151.398h-6.219l-1.187 2.781h-2.172l5.453-12.343h2.14l5.391 12.343H248.4zm-.797-1.86l-2.328-5.484-2.328 5.485zm0 0M261.844 154.18l-2.25-3.735a6.762 6.762 0 01-.563.016h-2.937v3.718h-2.078v-12.343h5.015c1.57 0 2.79.37 3.656 1.11.875.73 1.313 1.765 1.313 3.108 0 .981-.227 1.813-.672 2.5-.437.68-1.07 1.18-1.89 1.5l2.765 4.125zm-5.75-5.594h2.937c1.988 0 2.985-.828 2.985-2.485 0-1.601-.997-2.406-2.985-2.406h-2.937zm0 0M270.6 154.18h-2.077v-12.344h2.078zm0 0M276.47 143.57c1.257-1.195 2.812-1.797 4.656-1.797 1.844 0 3.394.602 4.656 1.797 1.258 1.2 1.89 2.68 1.89 4.438 0 1.761-.632 3.246-1.89 4.453-1.262 1.21-2.812 1.812-4.656 1.812-1.844 0-3.399-.601-4.656-1.812-1.262-1.207-1.891-2.692-1.891-4.453 0-1.758.629-3.239 1.89-4.438zm4.671.078c-1.218 0-2.265.422-3.14 1.266-.867.836-1.297 1.867-1.297 3.094 0 1.218.437 2.257 1.312 3.109.875.855 1.914 1.281 3.125 1.281 1.219 0 2.254-.426 3.11-1.281.851-.852 1.28-1.89 1.28-3.11 0-1.226-.429-2.257-1.28-3.093-.856-.844-1.89-1.266-3.11-1.266zm0 0M295.713 141.742c1.594 0 3.031.422 4.312 1.266l-.859 1.843c-1.262-.77-2.469-1.156-3.625-1.156-.617 0-1.105.117-1.469.344-.355.219-.531.539-.531.953 0 .406.16.758.484 1.047.332.293.743.508 1.235.64.5.137 1.035.31 1.61.516.57.2 1.1.414 1.593.64.5.231.91.59 1.234 1.079.32.492.485 1.078.485 1.765 0 1.086-.434 1.954-1.297 2.61-.867.648-1.985.969-3.36.969a7.264 7.264 0 01-2.734-.532 7.618 7.618 0 01-2.312-1.437l.906-1.797a7.056 7.056 0 002.047 1.328c.75.313 1.46.469 2.14.469.727 0 1.29-.129 1.688-.39.406-.27.61-.641.61-1.11 0-.414-.169-.77-.5-1.063-.325-.289-.735-.504-1.235-.64a31.193 31.193 0 01-1.594-.485 20.39 20.39 0 01-1.61-.625 2.936 2.936 0 01-1.234-1.047c-.324-.476-.484-1.062-.484-1.75 0-1.039.41-1.875 1.234-2.5.82-.625 1.91-.937 3.266-.937zm0 0"
              />
              <G clip-path="url(#prefix__a)">
                <Path
                  fill="#000"
                  d="M113.078 6.625l44.149 44.148h126.41l11.023 13.094-11.023 13.09h-12.508l-3.5-6.996h-8.16l-3.5 6.996h-7.844l-3.5-6.996h-8.055l-3.496 6.996h-7.793l-3.5-6.996h-8.16l-3.5 6.996h-52.84L106.72 26.395 55.89 76.957H29.707l27.297-27.293v-26.45h18.285v8.161L106.664 0zm49.133 49.133l1.746 1.75h118.832v-1.75zm0 0"
                />
              </G>
              <G clip-path="url(#prefix__b)">
                <Path d="M95.375 54.273h9.594v9.86h-9.594zm12.773 0h9.594v9.86h-9.594zm9.594 12.774v9.86h-9.594v-9.86zm-12.773 9.91h-9.594v-9.855h9.594zm0 0" />
              </G>
            </Svg>
          </View>

          <Text style={styles.title}>INFORME DE TASACIÓN</Text>
          <Text style={styles.subtitle}>MÉTODO: ROSS-HEIDECKE</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.propertyLine}>
            <Text style={styles.propertyLabel}>Valuación de casa sobre</Text>
            <Text style={styles.propertyValue}>{propiedad}</Text>
          </View>
          <Text style={styles.propertyLocation}>
            de la localidad de La Carlota, provincia de Córdoba.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            La fórmula que se aplicará para la depreciación física será:
          </Text>
          <Text style={styles.formula}>Va = VR - (VR - Vr) K</Text>

          <Text style={styles.text}>Siendo:</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemContent}>Va: valor actual</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemContent}>
              VR: valor de reposición o costo de reposición bruto.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemContent}>Vr: valor residual</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemContent}>
              K: coeficiente según porcentaje de vida transcurrida y estado.
              Tabla de Ross-Heidecke.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>A continuación se reproduce la tabla:</Text>
          <Text style={styles.text}>
            Primera fila, determina el estado del bien según el siguiente orden:
          </Text>

          <View style={styles.stateTable}>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>1.0</Text>
              <Text style={styles.stateCell}>Excelente</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>1.5</Text>
              <Text style={styles.stateCell}>Muy bueno</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>2.0</Text>
              <Text style={styles.stateCell}>Bueno</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>2.5</Text>
              <Text style={styles.stateCell}>Normal</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>3.0</Text>
              <Text style={styles.stateCell}>Regular</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>3.5</Text>
              <Text style={styles.stateCell}>Malo</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>4.0</Text>
              <Text style={styles.stateCell}>Muy malo</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>4.5</Text>
              <Text style={styles.stateCell}>Demolición</Text>
            </View>
            <View style={styles.stateRow}>
              <Text style={styles.stateCellBold}>5.0</Text>
              <Text style={styles.stateCell}>Irrecuperable</Text>
            </View>
          </View>

          <Text style={styles.text}>
            Primera columna determina el porcentaje de vida transcurrida con
            relación a la vida útil del bien.
          </Text>
          <Text style={styles.text}>
            El valor obtenido en la tabla debe dividirse por cien para obtener
            el coeficiente K.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            - La valuación en pesos ($) de la construcción es la siguiente:
          </Text>
          <Text style={styles.formula}>
            {formatCurrency(valorActual)} = {formatCurrency(valorReposicion)} -
            ({formatCurrency(valorReposicion)} - {formatCurrency(valorResidual)}
            ) x {(coeficienteK / 100).toFixed(4)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            - La valuación en pesos ($) del terreno es la siguiente:
          </Text>
          <Text style={styles.text}>
            Basándonos en el precio del m2 de terreno, valuado en{" "}
            {formatCurrency(valorM2)}, y calculando las dimensiones de la
            propiedad en {cantidadM2} m2, tenemos:
          </Text>
          <Text style={styles.formula}>
            {formatCurrency(valorM2)} x {cantidadM2} ={" "}
            {formatCurrency(valorTerreno)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            - Teniendo esto en consideración, tenemos la siguiente valoración:
          </Text>
          <Text style={styles.formula}>
            {formatCurrency(valorActual)} + {formatCurrency(valorTerreno)} ={" "}
            {formatCurrency(valorTotal)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            En vista de lo anteriormente expresado, la propiedad en su totalidad
            estaría valuada en{" "}
            <Text style={styles.bold}>{formatCurrency(valorTotal)}.-</Text>
          </Text>
          <Text style={styles.text}>
            Basándonos en el precio del Dólar, del día de la fecha, el valor del
            inmueble quedaría tasado en{" "}
            <Text style={styles.bold}>
              U$D {valorTotalDolares.toFixed(2)}.-
            </Text>
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default function PdfGenerator(props: PdfGeneratorProps) {
  const [isClient, setIsClient] = useState(false);

  // Asegurarse de que el componente se renderice solo en el cliente
  // para evitar errores de hidratación con Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fileName = `Tasacion_${props.propiedad.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  if (!isClient) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed flex items-center justify-center"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        Cargando...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<TasacionPDF {...props} />}
      fileName={fileName}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
      style={{ textDecoration: "none" }}
    >
      {({ loading }) =>
        loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generando PDF...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Descargar Tasación en PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
