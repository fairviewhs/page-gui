import { BaseComponent, ComponentStructure, BaseProperty } from "./types";

import ParagraphInput from "./BaseComponents/ParagraphInput";
import Paragraph from "./BaseComponents/Paragraph";
import { EditorState } from "draft-js";
import StringInput from "./BaseComponents/StringInput";
import StringRender from "./BaseComponents/StringRender";
import Ribbon from "./Templates/Ribbon";
import RibbonCard from "./Templates/RibbonCard";
import SmallRibbonCard from "./Templates/SmallRibbonCard";
import Card from "./Templates/Card";
import ImageCard from "./Templates/ImageCard";
import TitleCard from "./Templates/TitleCard";
import AccordionCard from "./Templates/AccordionCard";
import AccordionStackItem from './Templates/AccordionStackCard';
import CheckList from "./Templates/CheckList/CheckList";
import CheckListSummary from "./Templates/CheckList/CheckListSummary";
import CheckListCriteria from "./Templates/CheckList/CheckListCriteria";
import CheckListItem from "./Templates/CheckList/CheckListItem";
import SectionCard from "./Templates/SectionCard/SectionCard";
import SectionMainBanner from "./Templates/SectionCard/SectionMainBanner";
import Section from "./Templates/SectionCard/Section";
import SectionSubBanner from "./Templates/SectionCard/SectionSubBanner";
import Link from "./Templates/Link";
import Table from "./Templates/Table/Table";
import TableRow from "./Templates/Table/TableRow";
import TableColumn from "./Templates/Table/TableColumn";

const config = {
  generateDefaultValue: (type: BaseProperty): any => {
    if (typeof type === 'object' || type === 'component') {
      return [];
    } else if (type === 'string') {
      return '';
    } else if (type === 'paragraph') { 
      return EditorState.createEmpty();
    } else {
      throw new TypeError(`Could not generate default value for unknown property type "${type}"`);
    }
  },
  baseInputs: [
    {
      name: 'paragraph',
      inputComponent: ParagraphInput,
      renderComponent: Paragraph,
      defaultValue: EditorState.createEmpty()
    },
    {
      name: 'string',
      inputComponent: StringInput,
      renderComponent: StringRender,
      defaultValue: ''
    }
  ] as BaseComponent<any>[],
  componentStructures: [
    {
      component: Ribbon,
      name: 'Ribbon',
      propertyTypes: {
        children: 'string'
      }
    },
    {
      component: RibbonCard,
      name: 'Ribbon Card',
      propertyTypes: {
        title: 'string',
        children: 'component'
      }
    },
    {
      component: SmallRibbonCard,
      name: 'Small Ribbon Card',
      propertyTypes: {
        title: 'string',
        children: 'component'
      }
    },
    {
      component: Card,
      name: 'Basic Card',
      propertyTypes: {
        children: {
          allowed: ['Paragraph', 'Check List']
        }
      }
    },
    {
      component: ImageCard,
      name: 'Image Card',
      propertyTypes: {
        url: 'string',
        children: 'string'
      }
    },
    {
      component: TitleCard,
      name: 'Title Card',
      propertyTypes: {
        title: 'string',
        children: 'string'
      }
    },
    {
      component: AccordionCard,
      name: 'Accordion Card',
      propertyTypes: {
        title: 'string',
        children: 'string'
      }
    },
    {
      component: AccordionStackItem,
      name: 'Accordion Stack Item',
      propertyTypes: {
        title: 'string',
        children: 'string'
      }
    },
    {
      component: CheckList,
      name: 'Check List',
      propertyTypes: {
        children: {
          custom: [
            {
              component: CheckListSummary,
              name: 'Check List Summary',
              propertyTypes: {
                children: 'paragraph'
              }
            },
            {
              component: CheckListCriteria,
              name: 'Check List Criteria',
              propertyTypes: {
                children: {
                  custom: [
                    {
                      component: CheckListItem,
                      name: 'Check List Item',
                      propertyTypes: {
                        children: 'string'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    {
      component: AccordionCard,
      name: 'TEST ACCORDION CARD',
      propertyTypes: {
        title: 'string',
        children: 'component'
      }
    },
    {
      component: SectionCard,
      name: 'Section',
      propertyTypes: {
        title: 'string',
        children: {
          custom: [
            {
              component: SectionMainBanner,
              name: 'Main Banner',
              propertyTypes: {
                children: 'string'
              }
            },
            {
              component: Section,
              name: 'Body',
              propertyTypes: {
                children: 'string'
              }
            },
            {
              component: SectionSubBanner,
              name: 'Section Sub Banner',
              propertyTypes: {
                children: 'string',
              }
            }
          ]
        }
      }
    },
    {
      component: Link,
      name: 'Link',
      propertyTypes: {
        url: 'string',
        red: 'boolean',
        children: 'string'
      }
    },
    {
      component: Table,
      name: 'Table',
      propertyTypes: {
        title: 'string',
        children: {
          custom: [
            {
              component: TableRow,
              name: 'Row',
              propertyTypes: {
                title: 'string',
                children: {
                  custom: [
                    {
                      component: TableColumn,
                      name: 'Column',
                      propertyTypes: {
                        children: 'string'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  ] as ComponentStructure[]
}

export default config;