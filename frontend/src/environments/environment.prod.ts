export const environment = {
  production: true,
  url: 'https://www.backend.gosimilares.online',
  dtOptions: {
    pagingType: 'full_numbers',
    pageLength: 50,
    //dom: 'lrtip',
    lengthMenu : [50, 100, 200],
    //dom: 'rtip',
    processing: true,
    responsive: true,
    dom: 'Bfrtip', // Activa los botones
    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
    language: {
      url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
    }
  }
};
