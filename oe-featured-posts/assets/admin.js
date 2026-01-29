jQuery(document).ready(function ($) {
  const maxFeatured = cfpData.maxFeatured;
  let currentFeatured = cfpData.currentFeatured;
  let usedOrders = new Set();

  // Function to check the total number of featured posts
  function checkTotalFeaturedCount() {
    return $.post(cfpData.ajaxUrl, {
      action: 'cfp_check_featured_count'
    });
  }

  // Function to get all used orders across all pages
  function getUsedOrders() {
    return $.post(cfpData.ajaxUrl, {
      action: 'cfp_get_used_orders'
    }).done(function (response) {
      if (response.success) {
        usedOrders = new Set(response.data.usedOrders);
        updateAllOrderSelects();
      }
    });
  }

  // Function to check the number of selected checkboxes and disable others if needed
  function enforceFeaturedLimit() {
    const canAddMore = currentFeatured < maxFeatured;

    $(".cfp-featured-checkbox").each(function () {
      if (!$(this).is(":checked")) {
        $(this).prop("disabled", !canAddMore);
      }
    });

    // Show/hide warning message
    const warningMessage = $("#cfp-limit-warning");
    if (warningMessage.length === 0) {
      $("<div id='cfp-limit-warning' class='notice notice-warning' style='display: none; margin: 10px 0;'></div>")
        .text(`Maximum of ${maxFeatured} featured posts allowed is reached. Uncheck one of them to set new one.`)
        .insertAfter(".wp-header-end");
    }
    warningMessage.toggle(!canAddMore);
  }

  // Function to toggle the order select dropdown based on checkbox status
  function toggleOrderSelect(checkbox) {
    const postId = $(checkbox).data("post-id");
    const orderSelect = $(`.cfp-order-select[data-post-id=${postId}]`);

    if ($(checkbox).is(":checked")) {
      orderSelect.prop("disabled", false);
      updateOrderSelectOptions(orderSelect);
    } else {
      // Reset the order select to default '-' and disable it
      const previousValue = orderSelect.val();
      orderSelect.val("-").prop("disabled", true);

      // Remove the selected order from the used orders list
      if (previousValue !== "-") {
        usedOrders.delete(previousValue);
        updateAllOrderSelects();
      }

      // Save reset order via AJAX
      $.post(cfpData.ajaxUrl, {
        action: "cfp_save_order",
        post_id: postId,
        order: "-",
      });
    }
  }

  // Function to update options in a single order select
  function updateOrderSelectOptions($select) {
    const currentValue = $select.val();
    $select.find("option").each(function () {
      const value = $(this).val();
      if (value !== "-") {
        $(this).prop("disabled", usedOrders.has(value) && value !== currentValue);
      }
    });
  }

  // Function to update all order selects
  function updateAllOrderSelects() {
    $(".cfp-order-select").each(function () {
      const $select = $(this);
      const postId = $select.data("post-id");
      const checkbox = $(`.cfp-featured-checkbox[data-post-id=${postId}]`);
      const isChecked = checkbox.is(":checked");

      if (!isChecked) {
        $select.val("-").prop("disabled", true);
      } else {
        $select.prop("disabled", false);
        updateOrderSelectOptions($select);
      }
    });
  }

  // Checkbox change event
  $(".cfp-featured-checkbox").on("change", function () {
    const postId = $(this).data("post-id");
    const isChecked = $(this).is(":checked");
    const checkbox = $(this);
    const orderSelect = $(`.cfp-order-select[data-post-id=${postId}]`);
    const previousOrder = orderSelect.val();

    // Check if we're trying to exceed the limit
    if (isChecked && currentFeatured >= maxFeatured) {
      checkbox.prop("checked", false);
      enforceFeaturedLimit();
      return;
    }

    // If unchecking, make the order available immediately
    if (!isChecked && previousOrder !== "-") {
      usedOrders.delete(previousOrder);
      updateAllOrderSelects();
    }

    // Save featured status via AJAX
    $.post(cfpData.ajaxUrl, {
      action: "cfp_save_featured_status",
      post_id: postId,
      featured: isChecked ? 1 : 0,
    }).done(function (response) {
      if (response.success) {
        // Update the current featured count
        currentFeatured = response.data.totalFeatured;
        // Toggle the order select dropdown based on checkbox status
        toggleOrderSelect(checkbox);
        // Get updated list of used orders
        getUsedOrders();
        // Enforce the featured post limit
        enforceFeaturedLimit();
      } else {
        // If server rejected the change, revert the checkbox
        checkbox.prop("checked", !isChecked);
        enforceFeaturedLimit();
      }
    }).fail(function () {
      // If AJAX failed, revert the checkbox
      checkbox.prop("checked", !isChecked);
      enforceFeaturedLimit();
    });
  });

  // Order select change event
  $(".cfp-order-select").on("change", function () {
    const postId = $(this).data("post-id");
    const newValue = $(this).val();
    const previousValue = $(this).data("previous-value");

    // Remove the old selection from the used orders
    if (previousValue && previousValue !== "-") {
      usedOrders.delete(previousValue);
    }

    // Add the new selection to the used orders
    if (newValue !== "-") {
      usedOrders.add(newValue);
    }

    // Update all order selects
    updateAllOrderSelects();

    // Save the new order via AJAX
    $.post(cfpData.ajaxUrl, {
      action: "cfp_save_order",
      post_id: postId,
      order: newValue,
    });

    // Update the previous value
    $(this).data("previous-value", newValue);
  });

  // Initialize the state of order selects on page load
  $(".cfp-featured-checkbox").each(function () {
    toggleOrderSelect(this);
  });

  // Initialize used orders on page load
  $(".cfp-order-select").each(function () {
    const initialValue = $(this).val();
    if (initialValue !== "-") {
      $(this).data("previous-value", initialValue);
      usedOrders.add(initialValue);
    } else {
      $(this).data("previous-value", "-");
    }
  });

  // Check total count and get used orders on page load
  $.when(
    checkTotalFeaturedCount(),
    getUsedOrders()
  ).done(function (countResponse, ordersResponse) {
    if (countResponse[0].success) {
      currentFeatured = countResponse[0].data.totalFeatured;
      enforceFeaturedLimit();
    }
    if (ordersResponse[0].success) {
      usedOrders = new Set(ordersResponse[0].data.usedOrders);
      updateAllOrderSelects();
    }
  });
});
