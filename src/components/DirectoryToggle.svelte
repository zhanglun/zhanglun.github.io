<script lang="ts">
  const { className, name, list, onFilter } = $props();
  let expand = $state(false);

  let renderData: [string, number, boolean][] = $state(
    list.map(_ => [..._, false])
  );

  function handleSelect(item: [string, number, boolean], idx: number) {
    renderData[idx][2] = !renderData[idx][2];

    onFilter(renderData.filter(_ => _[2]));
  }

  export function clear() {
    renderData = renderData.map(_ => {
      _[2] = false;
      return _;
    });
  }
</script>

<div class={`directory ${className}`}>
  <div class="toggle">
    {#if expand}
      <svg
        class="directoryIcon"
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Folder Icon</title><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7 0H1V1H0V2V3V9H1V10H11V9H12V3H11V2H8V1H7V0ZM11 3V9H1V3H7H8H11ZM7 1V2H1V1H7Z"
          fill="currentColor"
        ></path>
      </svg>
    {/if}
    {#if !expand}
      <svg
        class="directoryIcon"
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Folder Icon</title><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1 0H7V1H1V0ZM1 6V1H0V9H1V10H11V9H12V3H11V2H8V1H7V2H8V3H11V4H3V5H2V6H1ZM1 7V9H11V5H3V6H2V7H1Z"
          fill="currentColor"
        ></path>
      </svg>
    {/if}
    {name}
  </div>
  <div class="content">
    <div class="content__inner">
      <ul class="filterList">
        {#each renderData as item, index}
          <li class="filterList__item">
            <div
              class="filterList__option"
              onclick={() => handleSelect(item, index)}
            >
              {#if !item[2]}
                <svg
                  width="10"
                  height="9"
                  viewBox="0 0 10 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="checkboxIcon"
                  class:checkboxIcon--active={item[2]}
                  ><title>Checkbox icon</title><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 1L-3.49691e-07 1L-4.37113e-08 8L1 8L1 9L9 9L9 8L10 8L10 1L9 1L9 -3.93402e-07L1 -4.37114e-08L1 1ZM1 1L9 1L9 8L1 8L1 1Z"
                    fill="currentColor"
                  ></path>
                </svg>
              {/if}
              {#if item[2]}
                <svg
                  width="10"
                  height="9"
                  viewBox="0 0 10 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="checkboxIcon"
                  class:checkboxIcon--active={item[2]}
                  ><title>Checkbox icon</title><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 1L-3.49691e-07 1L-4.37113e-08 8L1 8L1 9L9 9L9 8L10 8L10 1L9 1L9 -3.93402e-07L1 -4.37114e-08L1 1ZM1 1L9 1L9 8L1 8L1 1ZM7 2L8 2L8 3L7 3L7 2ZM6 4L6 3L7 3L7 4L6 4ZM5 5L5 4L6 4L6 5L5 5ZM4 6L4 5L5 5L5 6L4 6ZM3 6L4 6L4 7L3 7L3 6ZM3 6L2 6L2 5L3 5L3 6Z"
                    fill="currentColor"
                  ></path></svg
                >
              {/if}
              <span class:filterList__option--active={item[2]}>
                {item[0]}
                <span class="filterList__option-count">({item[1]})</span>
              </span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  .directory {
    display: flex;
    flex-direction: column;
    grid-column: 1/ 4;
  }
  .secondDir {
    grid-column: 4/7;
  }
  .toggle {
    --webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 8px;
    cursor: pointer;
    color: var(--filterTextActive);
    font-size: 14px;

    @media (max-width: 959px) {
      grid-column: 1 / 3;
      border-right: 1px dotted var(--dottedBorderColor);
      padding: 12px 12px 12px 0;
      align-items: center;
    }
  }

  .content {
    @media (max-width: 959px) {
      grid-column: 3 / -1;
      display: flex;
      flex-direction: row;
      height: 100%;
    }
  }

  .content__inner {
    display: flex;
    flex-direction: column;
    margin: 10px 0 0 7px;
    border-left: 1px dotted var(--filterBorderColor, --borderColorLight);
  }

  .filterList {
    margin: 0;
    padding-left: 12px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filterList__option {
    display: flex;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    background: transparent;
    color: var(--filterTextInactive, --inactiveColor);
    padding: 0;
    text-align: left;
    align-self: flex-start;
    align-items: center;
    gap: 8px;
    text-transform: capitalize;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;

    &:hover {
      color: var(--filterTextActive, --fontColor);
    }
  }

  .filterList__option--active {
    color: var(--invertedTextColor, --fontColor);
    background: var(--highlightColor);
  }

  .checkboxIcon {
    width: 15px;
    height: 15px;
    opacity: 0.4;
  }

  .checkboxIcon--active {
    opacity: 1;
  }

  .directoryIcon {
    color: var(--filterTextActive, --listItemIconColor);
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  @media (max-width: 959px) {
    .filterList {
      padding: 0 12px;
      flex-direction: row;
      gap: 12px;
      overflow-x: auto;
      overflow-y: hidden;
      max-width: calc(100vw - 32px);
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
      -webkit-mask-image: linear-gradient(
        90deg,
        transparent,
        #000 12px,
        #000 90%,
        transparent
      );
      mask-image: linear-gradient(
        90deg,
        transparent,
        #000 12px,
        #000 90%,
        transparent
      );
    }

    .filterList::-webkit-scrollbar {
      display: none;
    }

    .filterList__item {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      padding: 4px 0;
      height: 100%;
    }

    .checkboxIcon {
      display: none;
    }
  }

  @media (max-width: 959px) {
    .content,
    .directory {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1/-1;
      align-items: center;
    }

    .directory {
      border-bottom: 1px dotted var(--filterBorderColor, --borderColorLight);
    }

    /* .chevronIcon {
        display: none
    } */

    .content__inner {
      margin: 0;
      border: none;
    }

    .toggle {
      grid-column: 1/3;
      border-right: 1px dotted var(--dottedBorderColor);
      padding: 12px 12px 12px 0;
      align-items: center;
    }

    /* .collapse {
      overflow-x: auto;
    } */

    .content {
      grid-column: 3/-1;
      display: flex;
      flex-direction: row;
      height: 100%;
    }
  }
</style>
